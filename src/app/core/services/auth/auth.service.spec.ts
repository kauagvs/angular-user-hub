import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../models/auth.model';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockRouter = {
    navigateByUrl: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
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

  it('should login and set session', () => {
    const mockResponse: LoginResponse = { token: 'fake-token' };
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne(`${environment.baseURL}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should remove token on logout and navigate to root', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.getToken()).toBe('fake-token');
  });

  it('should return null if token does not exist in localStorage', () => {
    localStorage.removeItem('token');
    expect(service.getToken()).toBeNull();
  });

  it('should return true if user is authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if user is not authenticated', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBe(false);
  });
});
