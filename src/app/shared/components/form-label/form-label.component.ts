import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.scss']
})
export class FormLabelComponent {
  @Input() id: string = '';
  @Input() text: string = '';
  @Input() required: boolean = false
}
