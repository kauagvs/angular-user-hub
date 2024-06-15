import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../../core/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

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
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    avatar: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailsComponent],
      imports: [ModalComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);

    component['deleteModal'] = {
      openModal: jest.fn(),
      closeModal: jest.fn()
    } as unknown as ModalComponent;
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

  it('should open delete modal', () => {
    component.openDeleteModal();
    expect(component['deleteModal'].openModal).toHaveBeenCalled();
  });

  it('should confirm delete a user', () => {
    component.user = mockUser;
    mockUserService.deleteUser.mockReturnValue(of(undefined));

    component.confirmDeleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error when confirming delete a user', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    component.user = mockUser;
    mockUserService.deleteUser.mockReturnValue(throwError(() => new Error('Failed to delete user')));

    component.confirmDeleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting user: ', new Error('Failed to delete user'));
    expect(component.errorMessage).toBe('Error deleting user. Please try again later.');
  });

  it('should cancel delete user', () => {
    const closeModalSpy = jest.spyOn(component['deleteModal'], 'closeModal');
    component.cancelDeleteUser();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should navigate back to users list', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });
});
