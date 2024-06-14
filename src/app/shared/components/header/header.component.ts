import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, LogoComponent, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  constructor(private authService: AuthService) { }

  openMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('hidden');
    }
  }

  closeMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}
