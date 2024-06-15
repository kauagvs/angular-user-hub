import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotFoundComponent } from './page-not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../shared/components/button/button.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PageNotFoundComponent, ButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo'));
    expect(logoElement).toBeTruthy();
  });

  it('should display the error message', () => {
    const errorMessageElement = fixture.debugElement.query(By.css('h2'));
    expect(errorMessageElement.nativeElement.textContent.trim()).toBe('A página que você procura não foi encontrada!');
  });

  it('should have a button to go back to home', () => {
    const buttonElement: HTMLButtonElement =
      fixture.nativeElement.querySelector('app-button button');
    buttonElement.click();
    expect(buttonElement).toBeTruthy();
  });
});
