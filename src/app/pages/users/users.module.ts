import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UserInfoComponent,
    UserDetailsComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    RouterModule,
    HeaderComponent,
    ButtonComponent,
    ModalComponent,
    InputComponent
  ],
})
export class UsersModule {}
