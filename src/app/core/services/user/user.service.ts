import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse, SingleUserResponse } from '../../models/user.model';
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

  public getUser(userId: number): Observable<SingleUserResponse> {
    return this.http.get<SingleUserResponse>(`${this.BASE_API_URL}/users/${userId}`);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_API_URL}/users/${userId}`);
  }
}
