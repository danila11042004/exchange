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
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.scss']
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
