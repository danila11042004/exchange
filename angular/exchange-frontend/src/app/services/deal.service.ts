import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Deal {
  id: number;
  quantityPurchased: number;
  dealDate: string;
  shareCompanyName: string;
  buyerFullName: string;
}

@Injectable({ providedIn: 'root' })
export class DealService {
  private apiUrl = 'http://localhost:8080/api/deals';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Переименуем getMyDeals в getByUserId для согласованности
  getByUserId(userId: number): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${this.apiUrl}/by-user/${userId}`);
  }
  getAll() {
    return this.http.get<Deal[]>('http://localhost:8080/api/deals');
  }
  // Добавим метод getMyDeals с автоматическим определением userId
  getMyDeals(): Observable<Deal[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.getByUserId(userId);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createDeal(dealData: {
    shareId: number;
    quantity: number;
  }): Observable<Deal> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const headers = new HttpHeaders({
      'X-User-Id': userId.toString()
    });

    return this.http.post<Deal>(this.apiUrl, dealData, { headers });
  }
}
