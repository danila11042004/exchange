import { Component, OnInit } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Список сделок</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Акция</th>
          <th>Покупатель</th>
          <th>Количество</th>
          <th>Дата</th>
          <th *ngIf="isAdmin">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let deal of deals">
          <td>{{ deal.id }}</td>
          <td>{{ deal.shareCompanyName }}</td>
          <td>{{ deal.buyerFullName }}</td>
          <td>{{ deal.quantityPurchased }}</td>
          <td>{{ deal.dealDate | date:'medium' }}</td>
          <td *ngIf="isAdmin">
            <button (click)="deleteDeal(deal.id)">🗑️ Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  providers: [DatePipe],
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  `]
})
export class DealListComponent implements OnInit {
  deals: any[] = [];
  isAdmin = false;

  constructor(
    private dealService: DealService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(status => this.isAdmin = status);
    this.loadDeals();
  }

  loadDeals() {
    this.dealService.getAll().subscribe(data => this.deals = data);
  }

  deleteDeal(id: number) {
    if (confirm('Вы уверены, что хотите удалить сделку?')) {
      this.dealService.delete(id).subscribe(() => this.loadDeals());
    }
  }
}
