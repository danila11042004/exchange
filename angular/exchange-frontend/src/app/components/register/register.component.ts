import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  onSubmit() {
    const data = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: () => {
        // После успешной регистрации автоматически входим
        this.authService.login(this.email, this.password).subscribe({
          next: () => alert('Успешно зарегистрирован и вошел в систему!'),
          error: err => alert('Ошибка входа после регистрации: ' + err.error?.message)
        });
      },
      error: err => alert('Ошибка регистрации: ' + err.error?.message)
    });
  }
}
