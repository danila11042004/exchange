import { Component, OnInit } from '@angular/core';
import { BuyerService, Buyer } from '../../services/buyer.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buyer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buyer-list.component.html',
  styleUrls: ['./buyer-list.component.scss']
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
    if (!this.fullName.trim()) {
      alert('Поле ФИО обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.email.trim()) {
      alert('Поле Email обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.phone.trim()) {
      alert('Поле Телефон обязательно и не может содержать только пробелы');
      return;
    }
    if (!this.address.trim()) {
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
