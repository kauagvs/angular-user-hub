import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should set session token if credentials are valid', () => {
      const credentials = { email: 'test@example.com', password: '123456' };
      const mockResponse = { token: 'fake-jwt-token' };

      service.login(credentials).subscribe(result => {
        expect(result.token).toBe(mockResponse.token);
        expect(localStorage.getItem('token')).toBe(mockResponse.token);
      });

      const req = httpMock.expectOne(`${environment.baseURL}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle invalid credentials', () => {
      const credentials = { email: 'test@example.com', password: 'wrong-password' };

      service.login(credentials).subscribe(
        () => fail('should have failed with 400 error'),
        error => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${environment.baseURL}/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Invalid credentials', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle http error', () => {
      const credentials = { email: 'test@example.com', password: '123456' };

      service.login(credentials).subscribe(
        () => fail('should have failed with 500 error'),
        error => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`${environment.baseURL}/login`);
      expect(req.request.method).toBe('POST');
      req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if user is authenticated', () => {
      localStorage.setItem('token', 'some-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false if user is not authenticated', () => {
      localStorage.removeItem('token');
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to /login', () => {
      localStorage.setItem('token', 'some-token');
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');
      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith('/login');
    });
  });

  describe('getToken', () => {
    it('should return the token if it exists in localStorage', () => {
      const token = 'some-token';
      localStorage.setItem('token', token);
      expect(service.getToken()).toBe(token);
    });

    it('should return null if no token in localStorage', () => {
      localStorage.removeItem('token');
      expect(service.getToken()).toBeNull();
    });
  });
});
