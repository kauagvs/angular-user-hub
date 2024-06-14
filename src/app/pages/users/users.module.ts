import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpecialistsRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UserInfoComponent,
  ],
  imports: [
    CommonModule,
    SpecialistsRoutingModule,
    RouterModule,
    HeaderComponent,
    ButtonComponent
  ],
})
export class UsersModule {}
