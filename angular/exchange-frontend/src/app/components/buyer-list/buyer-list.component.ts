import { Component, OnInit } from '@angular/core';
import { BuyerService, Buyer } from '../../services/buyer.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buyer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Список покупателей</h2>
    <div class="form-container" *ngIf="isAdmin">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="fullName" placeholder="ФИО" required />
        <input formControlName="email" placeholder="Email" />
        <input formControlName="phone" placeholder="Телефон" />
        <input formControlName="address" placeholder="Адрес" />
        <button type="submit" [disabled]="form.invalid">
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
        <tr *ngFor="let buyer of buyers">
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
    }
    input {
      padding: 4px;
      flex: 1;
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
  form: FormGroup;
  editingBuyer: Buyer | null = null;

  // Переменная, указывающая, админ ли пользователь
  isAdmin = false;

  constructor(private buyerService: BuyerService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: [''],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    // Здесь нужно получить роль пользователя, например из сервиса авторизации
    // Ниже пример: this.isAdmin = authService.isUserAdmin();
    // Для примера ставим true:
    this.isAdmin = this.checkIfUserIsAdmin();

    this.loadBuyers();
  }

  checkIfUserIsAdmin(): boolean {
    // TODO: реализовать получение роли пользователя из authService или локального хранилища
    // Пример: return this.authService.currentUserValue?.roles.includes('ADMIN');
    return false; // Пока false, чтобы не было кнопок
  }

  loadBuyers() {
    this.buyerService.getAll().subscribe(data => {
      this.buyers = data.sort((a, b) => a.fullName.localeCompare(b.fullName));
    });
  }

  onSubmit() {
    if (!this.form.valid) return;

    if (this.editingBuyer) {
      const updated = { ...this.editingBuyer, ...this.form.value };
      this.buyerService.update(this.editingBuyer.id, updated).subscribe(() => {
        this.loadBuyers();
        this.cancelEdit();
      });
    } else {
      this.buyerService.create(this.form.value).subscribe(() => {
        this.loadBuyers();
        this.form.reset();
      });
    }
  }

  startEdit(buyer: Buyer) {
    this.editingBuyer = buyer;
    this.form.patchValue(buyer);
  }

  cancelEdit() {
    this.editingBuyer = null;
    this.form.reset();
  }

  deleteBuyer(buyer: Buyer) {
    if (confirm(`Удалить покупателя ${buyer.fullName}?`)) {
      this.buyerService.delete(buyer.id).subscribe(() => this.loadBuyers());
    }
  }
}
