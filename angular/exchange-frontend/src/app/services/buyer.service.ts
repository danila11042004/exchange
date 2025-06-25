import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Buyer {
  id: number;
  fullName: string;
  address: string;
  phone: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class BuyerService {
  private apiUrl = 'http://localhost:8080/api/buyers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.apiUrl);
  }
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
