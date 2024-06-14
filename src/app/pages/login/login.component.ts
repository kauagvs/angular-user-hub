import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public isAuthenticated: boolean = false;
  public errorMessage: string = '';

  private readonly destroy: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form.reset({
      email: '',
      password: '',
    });
  }

  public getEmailErrorMessage(): string {
    if (this.form.controls['email'].hasError('required')) {
      return 'Por favor insira um e-mail!';
    }
    if (this.form.controls['email'].hasError('email')) {
      return 'Insira um e-mail válido';
    }
    return '';
  }

  public getPasswordErrorMessage(): string {
    if (this.form.controls['password'].hasError('required')) {
      return 'Por favor insira uma senha!';
    }
    return '';
  }

  public login(): void {
    const credentials = {
      email: this.form.value.email,
      password: this.form.value.password,
    };


    if (credentials.email && credentials.password) {
      this.authService.login(credentials)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: () => {
            this.buildForm();
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            console.error('Authentication error: ', err);
            this.errorMessage = 'Usuário ou senha inválidos.';
            this.buildForm();
          },
          complete: () => {
            console.info('Authentication complete');
          }
        });
    }
  }
}
