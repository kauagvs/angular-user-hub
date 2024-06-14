import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        InputComponent, 
        ButtonComponent
      ],
      declarations: [LoginComponent],
      providers: [AuthService, FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form on init', () => {
    component.ngOnInit();
    expect(component.form).toBeTruthy();
    expect(component.form.controls['email']).toBeTruthy();
    expect(component.form.controls['password']).toBeTruthy();
  });

  describe('getEmailErrorMessage()', () => {
    it('should return required message', () => {
      component.form.controls['email'].setValue(null);
      fixture.detectChanges();

      const message = component.getEmailErrorMessage();

      expect(message).toEqual('Por favor insira um e-mail!');
    });

    it('should return invalid email message', () => {
      component.form.controls['email'].setValue('invalid_email');
      fixture.detectChanges();

      const message = component.getEmailErrorMessage();

      expect(message).toEqual('Insira um e-mail válido');
    });

    it('should return empty string when no error', () => {
      component.form.controls['email'].setValue('valid@email.com');
      fixture.detectChanges();

      const message = component.getEmailErrorMessage();

      expect(message).toEqual('');
    });
  });

  describe('getPasswordErrorMessage()', () => {
    it('should return required message', () => {
      component.form.controls['password'].setValue(null);
      fixture.detectChanges();

      const message = component.getPasswordErrorMessage();

      expect(message).toEqual('Por favor insira uma senha!');
    });

    it('should return empty string when no error', () => {
      component.form.controls['password'].setValue('validpassword');
      fixture.detectChanges();

      const message = component.getPasswordErrorMessage();

      expect(message).toEqual('');
    });
  });

  describe('login()', () => {
    it('should call login() when button is clicked', () => {
      jest.spyOn(component, 'login');

      component.form.setValue({ email: 'teste@email.com', password: '123456' });
      fixture.detectChanges();

      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector('app-button button');
      buttonElement.click();

      expect(component.login).toHaveBeenCalled();
    });

    it('should navigate to dashboard when authenticated', () => {
      jest.spyOn(router, 'navigateByUrl');
      jest.spyOn(authService, 'login').mockReturnValue(of({ token: 'fake-jwt-token' }));

      const credentials = { email: 'teste@email.com', password: '123456' };
      component.form.setValue(credentials);
      component.login();
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/users');
    });

    it('should rebuild form and not navigate if authentication fails', () => {
      jest.spyOn(router, 'navigateByUrl');
      jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Invalid credentials')));
      jest.spyOn(component as any, 'buildForm');

      const credentials = { email: 'teste@email.com', password: '123456' };
      component.form.setValue(credentials);
      component.login();
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect((component as any).buildForm).toHaveBeenCalled();
    });

    it('should handle authentication error', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Authentication error')));

      const credentials = { email: 'teste@email.com', password: '123456' };
      component.form.setValue(credentials);
      component.login();
      fixture.detectChanges();

      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(consoleSpy).toHaveBeenCalledWith('Authentication error: ', new Error('Authentication error'));
      expect(component.errorMessage).toBe('Usuário ou senha inválidos.');
    });

    it('should not call login if email or password is missing', () => {
      jest.spyOn(authService, 'login');

      component.form.setValue({ email: '', password: '123456' });
      component.login();
      fixture.detectChanges();
      expect(authService.login).not.toHaveBeenCalled();

      component.form.setValue({ email: 'teste@email.com', password: '' });
      component.login();
      fixture.detectChanges();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});
