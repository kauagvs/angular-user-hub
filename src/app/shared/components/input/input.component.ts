import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() getErrorMessage!: () => string;

  hide: boolean = false;

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  get inputType() {
    return this.type === 'password' && !this.hide ? 'password' : 'text';
  }
}
