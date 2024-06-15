import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserListResponse, SingleUserResponse } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users list from the API', () => {
    const mockResponse: UserListResponse = {
      page: 1,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: [
        { id: 1, email: 'test1@example.com', first_name: 'Test1', last_name: 'User1', avatar: 'avatar1.jpg' },
        { id: 2, email: 'test2@example.com', first_name: 'Test2', last_name: 'User2', avatar: 'avatar2.jpg' }
      ]
    };

    service.listUsers(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseURL}/users?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve single user details from the API', () => {
    const mockResponse: SingleUserResponse = {
      data: { id: 1, email: 'test1@example.com', first_name: 'Test1', last_name: 'User1', avatar: 'avatar1.jpg' }
    };

    service.getUser(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseURL}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete a user', () => {
    const userId = 1;

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.baseURL}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when retrieving users list', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service.listUsers(1).subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load users', error);
      }
    );

    const req = httpMock.expectOne(`${environment.baseURL}/users?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush('Failed to load users', { status: 500, statusText: 'Server Error' });

    consoleSpy.mockRestore();
  });

  it('should handle error when retrieving single user details', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service.getUser(1).subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load user', error);
      }
    );

    const req = httpMock.expectOne(`${environment.baseURL}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush('Failed to load user', { status: 500, statusText: 'Server Error' });

    consoleSpy.mockRestore();
  });

  it('should handle error when deleting a user', () => {
    const userId = 1;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service.deleteUser(userId).subscribe(
      () => fail('should have failed with an error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(consoleSpy).toHaveBeenCalledWith('Failed to delete user', error);
      }
    );

    const req = httpMock.expectOne(`${environment.baseURL}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Failed to delete user', { status: 500, statusText: 'Server Error' });

    consoleSpy.mockRestore();
  });

  it('should create a user', () => {
    const newUser = {
      name: 'morpheus',
      job: 'leader'
    };

    const createdUser = {
      name: 'morpheus',
      job: 'leader',
      id: '146',
      createdAt: '2024-06-15T03:16:31.126Z'
    };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne(`${environment.baseURL}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(createdUser);
  });
});
