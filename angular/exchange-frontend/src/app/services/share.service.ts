import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Share {
  id: number;
  companyName: string;
  companyAddress: string;
  price: number;
  quantityAvailable: number;
  controlStakeSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private apiUrl = 'http://localhost:8080/api/shares';

  constructor(private http: HttpClient) {}

  // Получение всех акций
  getAll(): Observable<Share[]> {
    return this.http.get<Share[]>(this.apiUrl);
  }

  // Создание новой акции
  create(share: Omit<Share, 'id'>): Observable<Share> {
    return this.http.post<Share>(this.apiUrl, share);
  }

  // Обновление акции по ID
  update(id: number, share: Omit<Share, 'id'>): Observable<Share> {
    return this.http.put<Share>(`${this.apiUrl}/${id}`, share);
  }

  // Удаление акции по ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
