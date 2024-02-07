import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddDiscountRequest } from 'src/app/@core/models/request/add-discount-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  styleUrls: ['./add-discount.component.scss']
})
export class AddDiscountComponent {
  discountForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  clientId: string | null = null;

  constructor(private _clientService: ClientService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) {

  }

  ngOnInit(): void {
    this.clientId = this._config.data?.clientId;
    this.initializeForm();
  }

  initializeForm(): void {
    this.discountForm = new FormGroup({
      concept: new FormControl<string>('', [Validators.required]),
      date: new FormControl<Date>(new Date(), []),
      amount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    });
  }

  onSubmitForm(paymentFormValue: any): void {
    if (!this.clientId) {
      this._ref.close(false);
      return;
    }

    this.formProcessEvent.emit(true);

    const discount: AddDiscountRequest = paymentFormValue;
    const clientId = this.clientId;

    this._clientService.addDiscount(clientId, discount)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Descuento registrado!', detail: 'Descuento registrado con éxito' });
        this._ref.close(true);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.discountForm, err.error.errors);
          } else {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
          }
        } else {
          this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
        }
      })
      .finally(() => this.formProcessEvent.emit(false));
  }
}
