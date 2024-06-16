import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UserService } from '../../../core/services/user/user.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { jsPDF } from 'jspdf';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let userService: UserService;

  const mockUserService = {
    listUsers: jest.fn(),
    deleteUser: jest.fn()
  };

  const mockUsersPage1 = [
    { id: 1, email: 'test1@example.com', first_name: 'Test1', last_name: 'User1', avatar: 'avatar1.jpg' },
    { id: 2, email: 'test2@example.com', first_name: 'Test2', last_name: 'User2', avatar: 'avatar2.jpg' }
  ];

  const mockUsersPage2 = [
    { id: 3, email: 'test3@example.com', first_name: 'Test3', last_name: 'User3', avatar: 'avatar3.jpg' },
    { id: 4, email: 'test4@example.com', first_name: 'Test4', last_name: 'User4', avatar: 'avatar4.jpg' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      imports: [ModalComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Papa, useValue: { unparse: jest.fn() } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    component['deleteModal'] = {
      openModal: jest.fn(),
      closeModal: jest.fn()
    } as unknown as ModalComponent;
  });

  beforeEach(() => {
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockUserService.listUsers.mockReturnValue(of({ data: mockUsersPage1, total_pages: 2 }));

    fixture.detectChanges();

    expect(userService.listUsers).toHaveBeenCalledWith(1);
    expect(component.users).toEqual(mockUsersPage1);
  });

  it('should handle error when loading users', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    mockUserService.listUsers.mockReturnValue(throwError(() => new Error('Failed to load users')));

    fixture.detectChanges();

    expect(userService.listUsers).toHaveBeenCalledWith(1);
    expect(component.users).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load users', new Error('Failed to load users'));
  });

  it('should load more users', () => {
    component.users = [...mockUsersPage1];
    component.totalPages = 2;
    mockUserService.listUsers.mockReturnValue(of({ data: mockUsersPage2, total_pages: 2 }));

    component.loadMoreUsers();

    expect(userService.listUsers).toHaveBeenCalledWith(2);
    expect(component.users).toEqual([...mockUsersPage1, ...mockUsersPage2]);
  });

  it('should open delete modal', () => {
    component.openDeleteModal(mockUsersPage1[0]);
    expect(component['deleteModal'].openModal).toHaveBeenCalled();
  });

  it('should confirm delete a user', () => {
    component.users = [...mockUsersPage1, ...mockUsersPage2];
    component['userToDelete'] = mockUsersPage1[0];
    mockUserService.deleteUser.mockReturnValue(of(undefined));

    component.confirmDeleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUsersPage1[0].id);
    expect(component.users).toEqual([...mockUsersPage1.slice(1), ...mockUsersPage2]);
  });

  it('should handle error when confirming delete a user', () => {
    component.users = [...mockUsersPage1, ...mockUsersPage2];
    component['userToDelete'] = mockUsersPage1[0];
    const consoleSpy = jest.spyOn(console, 'error');
    mockUserService.deleteUser.mockReturnValue(throwError(() => new Error('Failed to delete user')));

    component.confirmDeleteUser();

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUsersPage1[0].id);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to delete user', new Error('Failed to delete user'));
    expect(component.users).toEqual([...mockUsersPage1, ...mockUsersPage2]);
    expect(component['userToDelete']).toBeNull();
  });

  it('should cancel delete user', () => {
    const closeModalSpy = jest.spyOn(component['deleteModal'], 'closeModal');
    component.cancelDeleteUser();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should call editUser', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const userId = 1;

    component.editUser(userId);

    expect(consoleSpy).toHaveBeenCalledWith('Edit', userId);
  });

  it('should filter users based on search term', () => {
    component.users = [...mockUsersPage1, ...mockUsersPage2];
    component.searchTerm = 'Test1';
    component.filterUsers();
    expect(component.filteredUsers).toEqual([mockUsersPage1[0]]);
    
    component.searchTerm = 'User3';
    component.filterUsers();
    expect(component.filteredUsers).toEqual([mockUsersPage2[0]]);
    
    component.searchTerm = 'example.com';
    component.filterUsers();
    expect(component.filteredUsers).toEqual([...mockUsersPage1, ...mockUsersPage2]);
    
    component.searchTerm = 'nonexistent';
    component.filterUsers();
    expect(component.filteredUsers).toEqual([]);
  });

  it('should export users to PDF', () => {
    const doc = new jsPDF();
    const saveSpy = jest.spyOn(doc, 'save').mockImplementation(() => {
      return doc;
    });

    component.exportToPDF();
    component.exportToPDF = () => {
      doc.text('User List', 10, 10);
      doc.save('users-list.pdf');
    };

    component.filteredUsers = [...mockUsersPage1, ...mockUsersPage2];
    component.exportToPDF();
    expect(saveSpy).toHaveBeenCalledWith('users-list.pdf');
  });


  it('should export users to CSV', () => {
    const unParseSpy = jest.spyOn(component['papa'], 'unparse').mockReturnValue('csv content');

    component.filteredUsers = [...mockUsersPage1, ...mockUsersPage2];
    component.exportToCSV();

    expect(unParseSpy).toHaveBeenCalled();
  });
});
