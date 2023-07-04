import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() onProcessCompleted!: EventEmitter<boolean>;
  @Input() redirectBackRoute?: string;
  @Input() submitLabel: string = 'Enviar';
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  isProcessing: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.onProcessCompleted) {
      this.onProcessCompleted.subscribe((isProcessCompleted: boolean) => {
        this.isProcessing = isProcessCompleted;
      });
    }
  }

  onSubmitForm(): void {
    this.onSubmit.emit(this.form.value);
  }
}
