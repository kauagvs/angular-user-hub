import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_API_URL = environment.baseURL;

  constructor(private http: HttpClient, private router: Router) {}

  public login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_API_URL}/login`, credentials).pipe(
      map(result => {
        this.setSession(result);
        return result;
      })
    );
  }

  private setSession(authResult: LoginResponse): void {
    const token = authResult.token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  public logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.router.navigateByUrl('/');
  }

  public getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
