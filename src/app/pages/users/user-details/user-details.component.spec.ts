import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userService: UserService;
  let router: Router;

  const mockUserService = {
    getUser: jest.fn(),
    deleteUser: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn(),
    navigateByUrl: jest.fn()
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    avatar: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailsComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details on init', () => {
    mockUserService.getUser.mockReturnValue(of({ data: mockUser }));

    fixture.detectChanges();

    expect(userService.getUser).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
  });

  it('should handle error when loading user details', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    mockUserService.getUser.mockReturnValue(throwError(() => new Error('Failed to load user')));

    fixture.detectChanges();

    expect(userService.getUser).toHaveBeenCalledWith(1);
    expect(component.user).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading user: ', new Error('Failed to load user'));
    expect(component.errorMessage).toBe('Error loading user. Please try again later.');
  });

  it('should navigate to edit user page', () => {
    component.user = mockUser;
    component.editUser();

    expect(router.navigate).toHaveBeenCalledWith(['/users', mockUser.id, 'edit']);
  });

  it('should delete user and navigate to users list', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Mock user confirmation
    mockUserService.deleteUser.mockReturnValue(of(undefined));
    component.user = mockUser;

    component.deleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error when deleting user', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Mock user confirmation
    const consoleSpy = jest.spyOn(console, 'error');
    mockUserService.deleteUser.mockReturnValue(throwError(() => new Error('Failed to delete user')));
    component.user = mockUser;

    component.deleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting user: ', new Error('Failed to delete user'));
    expect(component.errorMessage).toBe('Error deleting user. Please try again later.');
  });

  it('should navigate back to users list', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });
});
