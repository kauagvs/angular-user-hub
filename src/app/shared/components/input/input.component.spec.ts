import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputComponent } from './input.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    component.controlName = 'email';
    component.label = 'E-mail';
    component.getErrorMessage = () => 'Error Message';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the input type correctly', () => {
    component.type = 'text';
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.getAttribute('type')).toBe('text');
  });

  it('should toggle input type to text when hide is true for password', () => {
    component.type = 'password';
    component.hide = true;
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.getAttribute('type')).toBe('text');
  });

  it('should toggle input type to password when hide is false for password', () => {
    component.type = 'password';
    component.hide = false;
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.getAttribute('type')).toBe('password');
  });

  it('should toggle password visibility on icon click', () => {
    component.type = 'password';
    component.hide = false;
    fixture.detectChanges();
    const toggleButton = fixture.debugElement.query(By.css('.fas'));
    toggleButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.hide).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.fa-eye-slash'))).toBeTruthy();

    toggleButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.hide).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.fa-eye'))).toBeTruthy();
  });

  it('should show error message when form control is invalid', () => {
    const emailControl = component.form.controls['email'];
    emailControl.markAsTouched();
    emailControl.setValue('');
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(By.css('.text-red-500')).nativeElement;
    expect(errorMessage.textContent.trim()).toBe('Error Message');
  });
});
