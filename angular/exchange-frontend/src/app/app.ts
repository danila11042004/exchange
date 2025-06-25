import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <a routerLink="/shares" routerLinkActive="active">Акции</a>
      <a routerLink="/buyers" routerLinkActive="active">Покупатели</a>
      <a routerLink="/deals" routerLinkActive="active">Сделки</a>
      <a routerLink="/create-deal" routerLinkActive="active">Новая сделка</a>
      <a routerLink="/profile" routerLinkActive="active">Кабинет</a>
      <a routerLink="/login">Вход</a>
      <a routerLink="/register">Регистрация</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav { background: #f0f0f0; padding: 1rem; }
    a { margin-right: 1rem; text-decoration: none; }
    a.active { font-weight: bold; color: #0066cc; }
  `]
})
export class App {}
