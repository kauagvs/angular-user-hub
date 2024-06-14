import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { User } from '../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  public users: User[] = [];
  public page: number = 1;
  public totalPages: number = 1;
  public noMorePosts: boolean = false;

  private readonly destroy: DestroyRef = inject(DestroyRef);

  constructor(private userService: UserService) { }

  public ngOnInit(): void {
    this.loadUsers();
  }

  public loadMoreUsers(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    this.userService.listUsers(this.page)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (response) => {
          this.users.push(...response.data);
          this.totalPages = response.total_pages;
          this.noMorePosts = this.page >= this.totalPages;
        },
        error: (err) => {
          console.error('Failed to load users', err);
        },
        complete: () => {
          console.info('User loading complete');
        },
      });
  }

  public editUser(userId: number): void {
    console.log('Edit', userId)
  }

  public deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: (err) => {
          console.error('Failed to delete user', err);
        }
      });
    }
  }
}
