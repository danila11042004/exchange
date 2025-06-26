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
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.scss']
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
        value = formatDate(deal.dealDate, 'dd.MM.yyyy', 'ru-RU').toLowerCase();
      } else {
        value = (deal[this.searchField] ?? '').toString().toLowerCase();
      }

      return value.includes(term);
    });
  }
}
