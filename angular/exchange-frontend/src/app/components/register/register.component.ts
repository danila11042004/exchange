import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BuyerService } from '../../services/buyer.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Регистрация</h2>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="fullName" name="fullName" placeholder="ФИО" required>
      <input [(ngModel)]="email" name="email" placeholder="Email" required>
      <input [(ngModel)]="phone" name="phone" placeholder="Телефон" required>
      <input [(ngModel)]="address" name="address" placeholder="Адрес" required>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Пароль" required>
      <button type="submit">Зарегистрироваться</button>
    </form>
  `
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  address = '';
  password = '';

  constructor(
    private authService: AuthService,
    private buyerService: BuyerService
  ) {}

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

    if (!this.password || this.password.trim().length === 0) {
      alert('Поле Пароль обязательно и не может содержать только пробелы');
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
      const emailExists = buyers.some(b => b.email === this.email);
      const phoneExists = buyers.some(b => b.phone === this.phone);

      if (emailExists) {
        alert('Пользователь с таким email уже зарегистрирован.');
        return;
      }

      if (phoneExists) {
        alert('Пользователь с таким телефоном уже зарегистрирован.');
        return;
      }

      const data = {
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        password: this.password
      };

      this.authService.register(data).subscribe({
        next: () => {
          this.authService.login(this.email, this.password).subscribe({
            next: () => alert('Успешно зарегистрирован и вошел в систему!'),
            error: err => alert('Ошибка входа после регистрации: ' + err.error?.message)
          });
        },
        error: err => alert('Ошибка регистрации: ' + err.error?.message)
      });
    });
  }

}
