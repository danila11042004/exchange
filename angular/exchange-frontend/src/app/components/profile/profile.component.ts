import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealService, Deal } from '../../services/deal.service';
import { BuyerService } from '../../services/buyer.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  deals$!: Observable<Deal[]>;
  buyer$!: Observable<any>;
  adminCode: string = '';
  isAdmin: boolean = false;

  constructor(
    private dealService: DealService,
    private buyerService: BuyerService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.buyer$ = this.buyerService.getById(user.id);
        this.deals$ = this.dealService.getByUserId(user.id);
      }
    });

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  verifyAdminCode() {
    this.authService.verifyAdmin(this.adminCode).subscribe(success => {
      if (!success) {
        alert('Неверный админ-код');
      }
    });
  }

  revokeAdmin() {
    this.isAdmin = false;
    this.adminCode = '';
    localStorage.removeItem('isAdmin');
    this.authService.setAdminStatus(false);
  }

  logout() {
    this.authService.logout();
  }
}
