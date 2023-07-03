import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input-number',
  templateUrl: './form-input-number.component.html',
  styleUrls: ['./form-input-number.component.scss']
})
export class FormInputNumberComponent {
  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';
  @Input() mode: string = 'integer' // integer|decimal
  @Input() maxDecimalDigits: number = 2
  @Input() minDecimalDigits: number = 2

  public get formControl() {
    return this.form.get(this.controlName);
  }

  public get isDecimal(): boolean {
    return this.mode === 'decimal'
  }
}
