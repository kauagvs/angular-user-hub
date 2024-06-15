import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ModalComponent, ButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal', () => {
    component.openModal();
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed'));
    expect(component.isOpen).toBe(true);
    expect(modalElement).toBeTruthy();
  });

  it('should close the modal', () => {
    component.openModal();
    fixture.detectChanges();
    component.closeModal();
    fixture.detectChanges();
    const modalElement = fixture.debugElement.query(By.css('.fixed'));
    expect(component.isOpen).toBe(false);
    expect(modalElement).toBeNull();
  });

  it('should emit confirm event and close the modal', () => {
    jest.spyOn(component.onConfirm, 'emit');
    component.openModal();
    fixture.detectChanges();
    component.confirm();
    expect(component.onConfirm.emit).toHaveBeenCalled();
    expect(component.isOpen).toBe(false);
  });

  it('should emit cancel event and close the modal', () => {
    jest.spyOn(component.onCancel, 'emit');
    component.openModal();
    fixture.detectChanges();
    component.cancel();
    expect(component.onCancel.emit).toHaveBeenCalled();
    expect(component.isOpen).toBe(false);
  });

  it('should stop event propagation on inner div click', () => {
    component.openModal();
    fixture.detectChanges();
    const event = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
    const innerDiv = fixture.debugElement.query(By.css('.relative')).nativeElement;
    innerDiv.dispatchEvent(event);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should call closeModal on background click', () => {
    jest.spyOn(component, 'closeModal');
    component.openModal();
    fixture.detectChanges();
    const background = fixture.debugElement.query(By.css('.fixed')).nativeElement;
    background.click();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
