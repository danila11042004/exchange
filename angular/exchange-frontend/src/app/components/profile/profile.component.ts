import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService, Deal } from '../../services/deal.service';
import { BuyerService } from '../../services/buyer.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Личный кабинет</h2>

    <div *ngIf="!(authService.currentUser$ | async)">
      <p>Пожалуйста, войдите в систему</p>
    </div>

    <div *ngIf="authService.currentUser$ | async as user">
      <!-- Админ-панель -->
      <div style="margin-bottom: 1rem;">
        <div *ngIf="!isAdmin">
          <input [(ngModel)]="adminCode" placeholder="Введите админ-код" />
          <button (click)="verifyAdminCode()">Получить права администратора</button>
        </div>
        <div *ngIf="isAdmin">
          <p>✅ У вас есть права администратора</p>
          <button (click)="revokeAdmin()">Отключить права администратора</button>
        </div>
      </div>

      <!-- Информация о пользователе -->
      <div *ngIf="buyer$ | async as buyer">
        <h3>Покупатель</h3>
        <p><strong>ФИО:</strong> {{ buyer.fullName }}</p>
        <p><strong>Email:</strong> {{ buyer.email }}</p>
        <p><strong>Телефон:</strong> {{ buyer.phone }}</p>
        <p><strong>Адрес:</strong> {{ buyer.address }}</p>
      </div>

      <!-- Сделки -->
      <div *ngIf="deals$ | async as deals">
        <h3>Ваши сделки</h3>
        <div *ngIf="deals.length === 0">
          <p>У вас пока нет сделок</p>
        </div>
        <table *ngIf="deals.length > 0">
          <thead>
            <tr>
              <th>Акция</th>
              <th>Количество</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let deal of deals">
              <td>{{ deal.shareCompanyName }}</td>
              <td>{{ deal.quantityPurchased }}</td>
              <td>{{ deal.dealDate | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    input {
      padding: 4px;
      margin-right: 8px;
    }
    button {
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      padding: 0.5rem;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  `]
})
export class ProfileComponent implements OnInit {
  deals$!: Observable<Deal[]>;
  buyer$!: Observable<any>;
  adminCode: string = '';
  isAdmin: boolean = false;

  constructor(
    private dealService: DealService,
    private buyerService: BuyerService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.buyer$ = this.buyerService.getById(user.id);
        this.deals$ = this.dealService.getByUserId(user.id);
      }
    });

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  verifyAdminCode() {
    this.authService.verifyAdmin(this.adminCode).subscribe(success => {
      if (!success) {
        alert('Неверный админ-код');
      }
    });
  }

  revokeAdmin() {
    this.isAdmin = false;
    this.adminCode = '';
    localStorage.removeItem('isAdmin');
    this.authService.setAdminStatus(false); // Метод нужно добавить в AuthService
  }
}
