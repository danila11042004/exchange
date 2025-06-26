import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareService, Share } from '../../services/share.service';
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
  isQuantityValid: boolean = true;
  shares: Share[] = [];
  isLoggedIn = false;

  constructor(
    private shareService: ShareService,
    private dealService: DealService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadShares();

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  loadShares() {
    this.shareService.getAll().subscribe(shares => {
      this.shares = shares;
    });
  }

  get selectedShare(): Share | undefined {
    return this.shares.find(s => s.id === this.selectedShareId);
  }

  blockMinus(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

  onQuantityChange() {
      if (!this.selectedShare) {
        this.isQuantityValid = false;
        return;
      }

      // Проверяем валидность, но не меняем quantity
      this.isQuantityValid =
        this.quantity >= 1 && this.quantity <= this.selectedShare.quantityAvailable;
    }

  onSubmit() {
    if (!this.isLoggedIn) {
      alert('Вы должны войти в систему, чтобы совершить сделку.');
      return;
    }

    if (!this.selectedShareId) {
      alert('Выберите акцию.');
      return;
    }

    const share = this.selectedShare;
    if (!share) {
      alert('Выбранная акция не найдена.');
      return;
    }

    if (this.quantity < 1) {
      alert('Количество акций должно быть минимум 1.');
      return;
    }

    if (this.quantity > share.quantityAvailable) {
      alert(`Доступно максимум ${share.quantityAvailable} акций.`);
      return;
    }

    const dealData = {
      shareId: this.selectedShareId,
      quantity: this.quantity
    };

    this.dealService.createDeal(dealData).subscribe({
      next: () => {
        alert('Сделка успешно создана!');
        const newQuantity = share.quantityAvailable - this.quantity;

        if (newQuantity > 0) {
          const updatedShare = { ...share, quantityAvailable: newQuantity };
          this.shareService.update(share.id, updatedShare).subscribe({
            next: (updated) => {
              this.shares = this.shares.map(s => s.id === updated.id ? updated : s);
              this.quantity = 1;
            },
            error: () => alert('Ошибка обновления количества акций.')
          });
        } else {
          this.shareService.delete(share.id).subscribe({
            next: () => {
              this.shares = this.shares.filter(s => s.id !== share.id);
              this.quantity = 1;
              this.selectedShareId = null;
            },
            error: () => alert('Ошибка удаления акции.')
          });
        }
      },
      error: (err) => {
        console.error('Ошибка:', err);
        alert('Ошибка при создании сделки.');
      }
    });
  }
}
