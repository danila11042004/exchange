import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }

    this.isAdminSubject.next(savedIsAdmin);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((user: any) => {
        this.setCurrentUser(user);
      })
    );
  }

  getAdminCode() {
    return this.http.get<string>(`${this.apiUrl}/admin-code`);
  }

  verifyAdmin(code: string) {
    return this.http.post<boolean>(`${this.apiUrl}/verify-admin`, code, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap((isAdmin: boolean) => {
        this.setAdminStatus(isAdmin);
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    this.setAdminStatus(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  }

  setAdminStatus(value: boolean) {
    this.isAdminSubject.next(value);
    localStorage.setItem('isAdmin', String(value));
  }

  private setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }
}
