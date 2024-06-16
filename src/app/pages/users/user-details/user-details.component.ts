import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  public user: User | undefined;
  public errorMessage: string = '';

  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  private readonly destroy: DestroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.loadUser(userId);
    });
  }

  private loadUser(userId: number): void {
    this.userService.getUser(userId)
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user: ', error);
        this.errorMessage = 'Error loading user. Please try again later.';
      }
    });
  }

  public editUser(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  public openDeleteModal(): void {
    this.deleteModal.openModal();
  }

  public confirmDeleteUser(): void {
    if (this.user) {
      this.userService.deleteUser(this.user.id)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error deleting user: ', error);
          this.errorMessage = 'Error deleting user. Please try again later.';
        }
      });
    }
  }

  public cancelDeleteUser(): void {
    this.deleteModal.closeModal();
  }

  public goBack(): void {
    this.router.navigate(['/users']);
  }
}
