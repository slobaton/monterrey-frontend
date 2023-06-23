import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private messageService: MessageService) { }

  public handleValidationErrors(form: FormGroup, errors: any) {
    Object.keys(errors).forEach(prop => {
      const formControl = form.get(prop);
      if (formControl) {
        formControl.setErrors({
          serverError: errors[prop]
        });
      }
    })

    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'Errores de validación.'
    });
  }
}
