import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareService } from '../../services/share.service';
import { DealService } from '../../services/deal.service';
import { AuthService } from '../../services/auth.service'; // Добавляем импорт

@Component({
  selector: 'app-create-deal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Совершить сделку</h2>
    <form #dealForm="ngForm" (ngSubmit)="onSubmit()">
      <select [(ngModel)]="selectedShareId" name="share" required>
        <option *ngFor="let share of shares$ | async" [value]="share.id">
          {{ share.companyName }} ({{ share.price | currency }})
        </option>
      </select>

      <input type="number" [(ngModel)]="quantity" name="quantity" min="1" required>

      <button type="submit" [disabled]="!dealForm.valid">Подтвердить</button>
    </form>
  `,
  styles: [`
    form { max-width: 500px; margin: 2rem auto; }
    select, input { width: 100%; padding: 0.5rem; margin: 0.5rem 0; }
  `]
})
export class CreateDealComponent implements OnInit {
  selectedShareId: number | null = null;
  quantity: number = 1;

  shares$: any;

  constructor(
    private shareService: ShareService,
    private dealService: DealService,
    private authService: AuthService // Добавляем AuthService
  ) {}

  ngOnInit() {
    this.shares$ = this.shareService.getAll();
    // Убираем buyers$, так как будем использовать текущего пользователя
  }

  onSubmit() {
    if (this.selectedShareId) {
      const dealData = {
        shareId: this.selectedShareId,
        quantity: this.quantity
      };

      this.dealService.createDeal(dealData).subscribe({
        next: () => alert('Сделка успешно создана!'),
        error: (err) => console.error('Ошибка:', err)
      });
    }
  }
}
