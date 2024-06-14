import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginResponse } from '../../models/auth.model';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: { navigateByUrl: jest.fn() } }]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token in localStorage', () => {
    const credentials = { email: 'test@example.com', password: '123456' };
    const mockResponse: LoginResponse = { token: 'fake-jwt-token' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      if (typeof localStorage !== 'undefined') {
        expect(localStorage.getItem('token')).toBe(mockResponse.token);
      }
    });

    const req = httpMock.expectOne(`${environment.baseURL}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and remove token from localStorage', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', 'fake-jwt-token');
    }

    service.logout();
    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('token')).toBeNull();
    }
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should return token from localStorage', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', 'fake-jwt-token');
      expect(service.getToken()).toBe('fake-jwt-token');
    } else {
      expect(service.getToken()).toBeNull();
    }
  });

  it('should return null if no token in localStorage', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    expect(service.getToken()).toBeNull();
  });

  it('should return true if authenticated', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', 'fake-jwt-token');
    }
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if not authenticated', () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should handle absence of localStorage gracefully', () => {
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: undefined });

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
  });
});
