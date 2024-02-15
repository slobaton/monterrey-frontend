import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/@core/services/common/validation.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService, private validationService: ValidationService) { }

  public handleError(err: any, form?: FormGroup): void {
    if (this.isHttpErrorResponse(err)) {
      this.handleHttpError(err, form);
    } else {
      this.showErrorMessage('Error inesperado, intente nuevamente...');
    }
  }

  private isHttpErrorResponse(err: any): boolean {
    return err instanceof HttpErrorResponse;
  }

  private handleHttpError(err: HttpErrorResponse, form?: FormGroup): void {
    const UNPROCESSABLE_ENTITY = 422;
    if (err.status === UNPROCESSABLE_ENTITY && form) {
      this.validationService.handleValidationErrors(form, err.error.errors);
    } else {
      this.showErrorMessage('La acción no se pudo realizar, intente nuevamente...');
    }
  }

  private showErrorMessage(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error!', detail });
  }
}
