import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let userService: UserService;
  let router: Router;

  const mockUserService = {
    createUser: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        InputComponent,
        ButtonComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with two controls', () => {
    expect(component.addUserForm.contains('name')).toBe(true);
    expect(component.addUserForm.contains('job')).toBe(true);
  });

  it('should make the name control required', () => {
    const control = component.addUserForm.get('name');
    control!.setValue('');
    expect(control!.valid).toBeFalsy();
  });

  it('should make the job control required', () => {
    const control = component.addUserForm.get('job');
    control!.setValue('');
    expect(control!.valid).toBeFalsy();
  });

  it('should call userService.createUser when form is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const createUserSpy = jest.spyOn(userService, 'createUser').mockReturnValue(of({}));

    component.addUserForm.setValue({
      name: 'Test User',
      job: 'Developer'
    });

    component.addUser();

    expect(createUserSpy).toHaveBeenCalledWith({ name: 'Test User', job: 'Developer' });
    expect(navigateSpy).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error when userService.createUser fails', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    jest.spyOn(userService, 'createUser').mockReturnValue(throwError(() => new Error('Failed to create user')));

    component.addUserForm.setValue({
      name: 'Test User',
      job: 'Developer'
    });

    component.addUser();

    expect(consoleSpy).toHaveBeenCalledWith('Error creating user: ', new Error('Failed to create user'));
  });

  it('should return the correct error message', () => {
    expect(component.getErrorMessage()).toBe('Este campo é obrigatório');
  });
});
