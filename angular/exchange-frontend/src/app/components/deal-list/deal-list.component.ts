import { Component, OnInit } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
    <h2>Список сделок</h2>

    <div style="margin-bottom: 10px;">
      <label>Поиск по:
        <select [(ngModel)]="searchField">
          <option value="shareCompanyName">Акция</option>
          <option value="buyerFullName">Покупатель</option>
          <option value="quantityPurchased">Количество</option>
          <option value="dealDate">Дата</option>
        </select>
      </label>
      <input [(ngModel)]="searchTerm" placeholder="Введите значение для поиска" />
    </div>

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
        <tr *ngFor="let deal of filteredDeals()">
          <td>{{ deal.id }}</td>
          <td>{{ deal.shareCompanyName }}</td>
          <td>{{ deal.buyerFullName }}</td>
          <td>{{ deal.quantityPurchased }}</td>
          <td>{{ deal.dealDate | date:'dd.MM.yyyy' }}</td>
          <td *ngIf="isAdmin">
            <button (click)="deleteDeal(deal.id)">🗑️ Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
    select, input {
      padding: 4px;
      margin-left: 8px;
    }
  `]
})
export class DealListComponent implements OnInit {
  deals: any[] = [];
  isAdmin = false;

  searchField: string = 'shareCompanyName';
  searchTerm: string = '';

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

  filteredDeals() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.deals;
    console.log('Поиск по полю:', this.searchField);
    return this.deals.filter(deal => {
      let value: string;

      if (this.searchField === 'dealDate') {
        // Преобразуем дату в формат dd.MM.yyyy
        value = formatDate(deal.dealDate, 'dd.MM.yyyy', 'ru-RU').toLowerCase();
      } else {
        value = (deal[this.searchField] ?? '').toString().toLowerCase();
      }

      return value.includes(term);
    });
  }
}
