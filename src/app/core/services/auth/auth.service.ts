import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_API_URL = environment.baseURL;

  constructor(private http: HttpClient, private router: Router) { }

  public login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.BASE_API_URL}/login`, credentials)
      .pipe(
        map(result => {
          this.setSession(result);
          return result;
        })
      );
  }

  private setSession(authResult: { token: string }): void {
    const token = authResult.token;
    localStorage.setItem('token', token);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
