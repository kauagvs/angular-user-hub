import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { By } from '@angular/platform-browser';
import { User } from '../../../../core/models/user.model';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    avatar: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const avatarElement = fixture.debugElement.query(By.css('img')).nativeElement;
    const nameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    const emailElement = fixture.debugElement.queryAll(By.css('p'))[0].nativeElement;
    const firstNameElement = fixture.debugElement.queryAll(By.css('p'))[1].nativeElement;
    const lastNameElement = fixture.debugElement.queryAll(By.css('p'))[2].nativeElement;

    expect(avatarElement.src).toContain(mockUser.avatar);
    expect(nameElement.textContent).toContain(`${mockUser.first_name} ${mockUser.last_name}`);
    expect(emailElement.textContent).toContain(mockUser.email);
    expect(firstNameElement.textContent).toContain(mockUser.first_name);
    expect(lastNameElement.textContent).toContain(mockUser.last_name);
  });
});
