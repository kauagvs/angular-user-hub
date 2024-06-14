import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../../core/services/user/user.service';
import { UsersListComponent } from './users-list.component';
import { of, throwError } from 'rxjs';
import { User } from '../../../core/models/user.model';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: UserService;

  const mockUserService = {
    listUsers: jest.fn(),
    deleteUser: jest.fn()
  };

  const mockUsersPage1: User[] = [
    { id: 1, email: 'test1@example.com', first_name: 'Test1', last_name: 'User1', avatar: 'avatar1.jpg' },
    { id: 2, email: 'test2@example.com', first_name: 'Test2', last_name: 'User2', avatar: 'avatar2.jpg' },
  ];

  const mockUsersPage2: User[] = [
    { id: 3, email: 'test3@example.com', first_name: 'Test3', last_name: 'User3', avatar: 'avatar3.jpg' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockUserService.listUsers.mockReturnValue(of({ data: mockUsersPage1, total_pages: 2 }));

    component.ngOnInit();

    expect(userService.listUsers).toHaveBeenCalledWith(1);
    expect(component.users).toEqual(mockUsersPage1);
    expect(component.totalPages).toBe(2);
  });

  it('should load more users', () => {
    mockUserService.listUsers.mockReturnValueOnce(of({ data: mockUsersPage1, total_pages: 2 }));
    mockUserService.listUsers.mockReturnValueOnce(of({ data: mockUsersPage2, total_pages: 2 }));

    component.ngOnInit();
    component.loadMoreUsers();

    expect(component.users).toEqual([...mockUsersPage1, ...mockUsersPage2]);
    expect(component.page).toBe(2);
    expect(component.noMorePosts).toBe(true);
  });

  it('should handle error when loading users', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    mockUserService.listUsers.mockReturnValue(throwError(() => new Error('Failed to load users')));

    component.ngOnInit();

    expect(userService.listUsers).toHaveBeenCalledWith(1);
    expect(component.users).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load users', new Error('Failed to load users'));
  });

  it('should call editUser', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const userId = 1;

    component.editUser(userId);

    expect(consoleSpy).toHaveBeenCalledWith('Edit', userId);
  });

  it('should delete a user', () => {
    const userId = 1;
    const initialUsers = [...mockUsersPage1, ...mockUsersPage2];
    component.users = initialUsers;

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    mockUserService.deleteUser.mockReturnValue(of(undefined));

    component.deleteUser(userId);

    expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    expect(component.users).toEqual(initialUsers.filter(user => user.id !== userId));
  });

  it('should handle error when deleting a user', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const userId = 1;
    component.users = [...mockUsersPage1, ...mockUsersPage2];

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    mockUserService.deleteUser.mockReturnValue(throwError(() => new Error('Failed to delete user')));

    component.deleteUser(userId);

    expect(userService.deleteUser).toHaveBeenCalledWith(userId);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete user', new Error('Failed to delete user'));
    expect(component.users).toEqual([...mockUsersPage1, ...mockUsersPage2]);
  });
});
