import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Список акций</h2>
    <table>
      <thead>
        <tr>
          <th>Компания</th>
          <th>Адрес</th>
          <th>Цена</th>
          <th>Доступно</th>
          <th>Контр. пакет</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let share of shares">
          <td>{{ share.companyName }}</td>
          <td>{{ share.companyAddress }}</td>
          <td>{{ share.price | currency }}</td>
          <td>{{ share.quantityAvailable }}</td>
          <td>{{ share.controlStakeSize }}%</td>
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
export class ShareListComponent implements OnInit {
  shares: any[] = [];

  constructor(private shareService: ShareService) {}

  ngOnInit() {
    this.shareService.getAll().subscribe(data => this.shares = data);
  }
}
