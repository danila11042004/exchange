import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Вход</h2>
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="email" name="email" placeholder="Email" required>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Пароль" required>
      <button type="submit">Войти</button>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (resp: any) => {
        alert('Добро пожаловать, ' + resp.fullName);
        // Перенаправление на профиль или другую страницу
      },
      error: err => alert('Ошибка входа: ' + err.error?.message)
    });
  }
}
