import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  public users: User[] = [];
  public filteredUsers: User[] = [];
  public page: number = 1;
  public totalPages: number = 1;
  public noMorePosts: boolean = false;
  public isDeleteModalOpen: boolean = true;
  public searchTerm: string = '';
  private userToDelete: User | null = null;

  @ViewChild('deleteModal') deleteModal!: ModalComponent;

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
          console.log(response)
          this.users.push(...response.data);
          this.filteredUsers = this.users;
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

  public filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  public editUser(userId: number): void {
    console.log('Edit', userId)
  }

  public openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.deleteModal.openModal();
  }

  public confirmDeleteUser(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.userToDelete!.id);
          this.filteredUsers = this.users;
          this.userToDelete = null;
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          this.userToDelete = null;
        },
        complete: () => {
          this.deleteModal.closeModal();
        }
      });
    }
  }

  public cancelDeleteUser(): void {
    this.userToDelete = null;
    this.deleteModal.closeModal();
  }
}
