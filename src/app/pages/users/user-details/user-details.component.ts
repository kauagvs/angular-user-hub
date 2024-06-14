import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
  public user: User | undefined;
  public errorMessage: string = '';

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
    this.userService.getUser(userId).subscribe({
      next: (response) => {
        this.user = response.data;
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

  public deleteUser(): void {
    if (this.user && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user.id).subscribe({
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

  public goBack(): void {
    this.router.navigate(['/users']);
  }
}
