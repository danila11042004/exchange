import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Buyer {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private apiUrl = 'http://localhost:8080/api/buyers'; // подкорректируй под свой бекенд

  constructor(private http: HttpClient) {}

  getAll(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.apiUrl);
  }

  create(buyer: Omit<Buyer, 'id'>): Observable<Buyer> {
    return this.http.post<Buyer>(this.apiUrl, buyer);
  }

  update(id: number, buyer: Omit<Buyer, 'id'>): Observable<Buyer> {
    return this.http.put<Buyer>(`${this.apiUrl}/${id}`, buyer);
  }
  getById(id: number): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
