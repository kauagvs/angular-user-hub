import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_API_URL = environment.baseURL;

  constructor(private http: HttpClient, private router: Router) { }

  public login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_API_URL}/login`, credentials)
      .pipe(
        map(result => {
          this.setSession(result);
          return result;
        })
      );
  }

  private setSession(authResult: LoginResponse): void {
    const token = authResult.token;
    localStorage.setItem('token', token);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  public getToken(): string | null {    
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
