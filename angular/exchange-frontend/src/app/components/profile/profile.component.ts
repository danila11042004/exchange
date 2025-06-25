import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService, Deal } from '../../services/deal.service';
import { BuyerService } from '../../services/buyer.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Личный кабинет</h2>

    <div *ngIf="!(authService.currentUser$ | async)">
      <p>Пожалуйста, войдите в систему</p>
    </div>

    <div *ngIf="authService.currentUser$ | async as user">
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
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.5rem; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f2f2f2; }
  `]
})
export class ProfileComponent implements OnInit {
  deals$!: Observable<Deal[]>;
  buyer$!: Observable<any>;

  constructor(
    private dealService: DealService,
    private buyerService: BuyerService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.buyer$ = this.buyerService.getById(user.id);
        // Используем getByUserId вместо getMyDeals для явного указания пользователя
        this.deals$ = this.dealService.getByUserId(user.id);
      }
    });
  }
}
