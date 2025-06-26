import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareService } from '../../services/share.service';
import { DealService } from '../../services/deal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-deal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Совершить сделку</h2>

    <div *ngIf="!isLoggedIn">
      <p>🔒 Пожалуйста, войдите в систему, чтобы совершить сделку.</p>
    </div>

    <form #dealForm="ngForm" (ngSubmit)="onSubmit()" *ngIf="isLoggedIn">
      <label for="share">Выберите акцию:</label>
      <select [(ngModel)]="selectedShareId" name="share" id="share" required>
        <option *ngFor="let share of shares$ | async" [value]="share.id">
          {{ share.companyName }} ({{ share.price | currency }})
        </option>
      </select>

      <label for="quantity">Количество акций:</label>
      <input type="number" [(ngModel)]="quantity" name="quantity" id="quantity" min="1" required
      (keydown)="blockMinus($event)">

      <button type="submit" [disabled]="!dealForm.valid">Подтвердить</button>
    </form>
  `,
  styles: [`
    form { max-width: 500px; margin: 2rem auto; }
    label { display: block; margin-top: 1rem; font-weight: bold; }
    select, input { width: 100%; padding: 0.5rem; margin-top: 0.3rem; }
    button { margin-top: 1rem; }
    p { color: #d00; font-weight: bold; text-align: center; }
  `]
})
export class CreateDealComponent implements OnInit {
  selectedShareId: number | null = null;
  quantity: number = 1;

  shares$: any;
  isLoggedIn = false;

  constructor(
    private shareService: ShareService,
    private dealService: DealService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.shares$ = this.shareService.getAll();

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
blockMinus(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'Minus') {
    event.preventDefault();
  }
}

  onSubmit() {
    if (!this.isLoggedIn) {
      alert('Вы должны войти в систему, чтобы совершить сделку.');
      return;
    }

    if (this.selectedShareId) {
      const dealData = {
        shareId: this.selectedShareId,
        quantity: this.quantity
      };

      this.dealService.createDeal(dealData).subscribe({
        next: () => alert('Сделка успешно создана!'),
        error: (err) => {
          console.error('Ошибка:', err);
          alert('Ошибка при создании сделки.');
        }
      });
    }
  }
}
