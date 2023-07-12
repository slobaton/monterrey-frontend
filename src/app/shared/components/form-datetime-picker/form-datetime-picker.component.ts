import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-datetime-picker',
  templateUrl: './form-datetime-picker.component.html',
  styleUrls: ['./form-datetime-picker.component.scss']
})
export class FormDatetimePickerComponent {

  @Input() form!: FormGroup;

  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';

  @Input() showIcon: boolean = false;
  @Input() timeEnabled: boolean = false;
}
