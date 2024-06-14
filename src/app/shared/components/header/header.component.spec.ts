import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LogoComponent } from '../logo/logo.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  isLoggedIn() {
    return true;
  }

  getUserName() {
    return 'Test User';
  }

  logout() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        LogoComponent,
        HeaderComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open mobile menu when menu icon is clicked', () => {
    const openMenuSpy = jest.spyOn(component, 'openMenu');
    const menuIcon = fixture.debugElement.query(By.css('.fa-bars'));
    menuIcon.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(openMenuSpy).toHaveBeenCalled();
    const mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu.classes['hidden']).toBeFalsy();
  });

  it('should close mobile menu when close icon is clicked', () => {
    component.openMenu();
    fixture.detectChanges();

    const closeMenuSpy = jest.spyOn(component, 'closeMenu');
    const closeIcon = fixture.debugElement.query(By.css('.fa-times'));
    closeIcon.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(closeMenuSpy).toHaveBeenCalled();
    const mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu.classes['hidden']).toBeTruthy();
  });

  it('should call logout method when logout button is clicked', () => {
    const logoutSpy = jest.spyOn(authService, 'logout');

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const logoutButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('app-button button');
      logoutButton.click();
      fixture.detectChanges();

      expect(logoutSpy).toHaveBeenCalled();
    });
  });
});
