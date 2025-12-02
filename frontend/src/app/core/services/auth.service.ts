import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.model';
import { LoginRequest } from '../models/login-request.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<ApiResponse<AuthData>> {
    const loginRequest: LoginRequest = { username, password };
    
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        if (response.data) {
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('password', password);
          localStorage.setItem('rol', response.data.rol);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  getCurrentRol(): string | null {
    return localStorage.getItem('rol');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  }

  getCredentials(): { username: string; password: string } | null {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    
    if (username && password) {
      return { username, password };
    }
    
    return null;
  }
}
