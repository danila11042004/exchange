import { Component, OnInit } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

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
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let deal of deals">
          <td>{{ deal.id }}</td>
          <td>{{ deal.shareCompanyName }}</td>
          <td>{{ deal.buyerFullName }}</td>
          <td>{{ deal.quantityPurchased }}</td>
          <td>{{ deal.dealDate | date:'medium' }}</td>
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

  constructor(private dealService: DealService) {}

  ngOnInit() {
    this.dealService.getAll().subscribe(data => this.deals = data);
  }
}
