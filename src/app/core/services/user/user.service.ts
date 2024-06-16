import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse, User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly BASE_API_URL = environment.baseURL;

  constructor(private http: HttpClient) { }

  public listUsers(page: number = 1): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.BASE_API_URL}/users`, {
      params: {
        page: page.toString()
      }
    });
  }

  public getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_API_URL}/users/${userId}`);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_API_URL}/users/${userId}`);
  }

  public createUser(user: { name: string, job: string }): Observable<any> {
    return this.http.post<any>(`${this.BASE_API_URL}/users`, user);
  }
}
