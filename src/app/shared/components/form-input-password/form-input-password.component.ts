import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input-password',
  templateUrl: './form-input-password.component.html',
  styleUrls: ['./form-input-password.component.scss']
})
export class FormInputPasswordComponent {
  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';

  public get formControl() {
    return this.form.get(this.controlName);
  }
}
