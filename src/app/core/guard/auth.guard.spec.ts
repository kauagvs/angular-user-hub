import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  const mockAuthService = {
    isAuthenticated: jest.fn()
  };

  const mockRouter = {
    navigateByUrl: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to root if user is not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
