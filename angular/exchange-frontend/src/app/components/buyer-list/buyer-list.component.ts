import { Component, OnInit } from '@angular/core';
import { BuyerService, Buyer } from '../../services/buyer.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buyer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Список покупателей</h2>

    <div style="margin-bottom: 10px;">
      <label>Поиск по:
        <select [(ngModel)]="filterField">
          <option value="fullName">ФИО</option>
          <option value="email">Email</option>
          <option value="phone">Телефон</option>
          <option value="address">Адрес</option>
        </select>
      </label>
      <input [(ngModel)]="filterValue" placeholder="Введите значение для поиска" />
    </div>

    <div class="form-container" *ngIf="isAdmin">
      <form (ngSubmit)="onSubmit()">
        <input [(ngModel)]="fullName" name="fullName" placeholder="ФИО" required />
        <input [(ngModel)]="email" name="email" placeholder="Email" required />
        <input [(ngModel)]="phone" name="phone" placeholder="Телефон" required />
        <input [(ngModel)]="address" name="address" placeholder="Адрес" required />
        <button type="submit">
          {{ editingBuyer ? 'Сохранить' : 'Добавить' }}
        </button>
        <button type="button" *ngIf="editingBuyer" (click)="cancelEdit()">Отмена</button>
      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Адрес</th>
          <th *ngIf="isAdmin">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let buyer of filteredBuyers()">
          <td>{{ buyer.fullName }}</td>
          <td>{{ buyer.email }}</td>
          <td>{{ buyer.phone }}</td>
          <td>{{ buyer.address }}</td>
          <td *ngIf="isAdmin">
            <button (click)="startEdit(buyer)">✏️</button>
            <button (click)="deleteBuyer(buyer)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    form {
      margin-bottom: 20px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    input, select {
      padding: 4px;
      flex: 1 1 200px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }
    th {
      background: #eee;
    }
    .form-container {
      position: sticky;
      top: 0;
      background: white;
      padding: 10px 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  `]
})
export class BuyerListComponent implements OnInit {
  buyers: Buyer[] = [];
  editingBuyer: Buyer | null = null;
  isAdmin = false;

  fullName = '';
  email = '';
  phone = '';
  address = '';

  filterField: keyof Buyer = 'fullName';
  filterValue = '';

  constructor(
    private buyerService: BuyerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(status => this.isAdmin = status);
    this.loadBuyers();
  }

  loadBuyers() {
    this.buyerService.getAll().subscribe(data => {
      this.buyers = data.sort((a, b) => a.fullName.localeCompare(b.fullName));
    });
  }

  filteredBuyers(): Buyer[] {
    if (!this.filterValue.trim()) return this.buyers;
    const value = this.filterValue.toLowerCase();
    return this.buyers.filter(b => {
      const field = b[this.filterField];
      return field !== null && field !== undefined && field.toString().toLowerCase().includes(value);
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    return phoneRegex.test(phone);
  }

  validateFullName(name: string): boolean {
    const nameRegex = /^[А-Яа-яЁёA-Za-z\s]+$/;
    return nameRegex.test(name);
  }

  onSubmit() {
    if (!this.fullName || this.fullName.trim().length === 0) {
      alert('Поле ФИО обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.email || this.email.trim().length === 0) {
      alert('Поле Email обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.phone || this.phone.trim().length === 0) {
      alert('Поле Телефон обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.address || this.address.trim().length === 0) {
      alert('Поле Адрес обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.validateFullName(this.fullName)) {
      alert('ФИО может содержать только буквы и пробелы.');
      return;
    }
    if (!this.validateEmail(this.email)) {
      alert('Введите корректный email.');
      return;
    }
    if (!this.validatePhone(this.phone)) {
      alert('Введите корректный номер телефона.');
      return;
    }

    this.buyerService.getAll().subscribe(buyers => {
      const emailExists = buyers.some(b => b.email === this.email && (!this.editingBuyer || b.id !== this.editingBuyer.id));
      const phoneExists = buyers.some(b => b.phone === this.phone && (!this.editingBuyer || b.id !== this.editingBuyer.id));

      if (emailExists) {
        alert('Пользователь с таким email уже существует.');
        return;
      }
      if (phoneExists) {
        alert('Пользователь с таким телефоном уже существует.');
        return;
      }

      const buyerData = { fullName: this.fullName, email: this.email, phone: this.phone, address: this.address };

      if (this.editingBuyer) {
        this.buyerService.update(this.editingBuyer.id, { ...this.editingBuyer, ...buyerData }).subscribe(() => {
          this.loadBuyers();
          this.cancelEdit();
        });
      } else {
        this.buyerService.create(buyerData).subscribe(() => {
          this.loadBuyers();
          this.clearForm();
        });
      }
    });
  }

  startEdit(buyer: Buyer) {
    this.editingBuyer = buyer;
    this.fullName = buyer.fullName ?? '';
    this.email = buyer.email ?? '';
    this.phone = buyer.phone ?? '';
    this.address = buyer.address ?? '';
  }

  cancelEdit() {
    this.editingBuyer = null;
    this.clearForm();
  }

  clearForm() {
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  deleteBuyer(buyer: Buyer) {
    if (confirm(`Удалить покупателя ${buyer.fullName}?`)) {
      this.buyerService.delete(buyer.id).subscribe(() => this.loadBuyers());
    }
  }
}
