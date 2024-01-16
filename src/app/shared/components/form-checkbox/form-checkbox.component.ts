import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss']
})
export class FormCheckboxComponent {
  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() value: string = '';
  @Input() label: string = '';

  public get formControl() {
    return this.form.get(this.controlName);
  }
}
