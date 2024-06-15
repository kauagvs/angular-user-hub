import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  public addUserForm: FormGroup;

  private readonly destroy: DestroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],
    });
  }

  addUser(): void {
    if (this.addUserForm.invalid) return;

    const newUser = this.addUserForm.value;
    this.userService.createUser(newUser)
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Error creating user: ', error);
      }
    });
  }

  getErrorMessage(): string {
    return 'Este campo é obrigatório';
  }
}
