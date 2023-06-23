import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss']
})
export class FormTextareaComponent {
  @Input() form!: FormGroup;
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() cols: number = 30;

  public get formControl() {
    return this.form.get(this.controlName);
  }
}
