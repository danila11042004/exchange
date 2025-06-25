import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAll(): Observable<Share[]> {
    return this.http.get<Share[]>(this.apiUrl); // Убрали withCredentials
  }
}
