import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buyer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Список покупателей</h2>
    <table>
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Адрес</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let buyer of buyers">
          <td>{{ buyer.fullName }}</td>
          <td>{{ buyer.email }}</td>
          <td>{{ buyer.phone }}</td>
          <td>{{ buyer.address }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  `]
})
export class BuyerListComponent implements OnInit {
  buyers: any[] = [];

  constructor(private buyerService: BuyerService) {}

  ngOnInit() {
    this.buyerService.getAll().subscribe(data => this.buyers = data);
  }
}
