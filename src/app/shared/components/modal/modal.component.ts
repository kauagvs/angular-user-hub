import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() title: string = 'Título';
  @Input() confirmLabel: string = 'Confirmar';
  @Input() cancelLabel: string = 'Cancelar';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>(); // Alterado para void
  public isOpen: boolean = false;

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
  }

  confirm(): void {
    this.onConfirm.emit();
    this.isOpen = false;
  }

  cancel(): void {
    this.onCancel.emit();
    this.isOpen = false;
    this.closeModal();
  }
}
