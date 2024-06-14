
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { LoginRoutingModule } from './login-routing.module';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    LogoComponent
  ],
})
export class LoginModule {}
