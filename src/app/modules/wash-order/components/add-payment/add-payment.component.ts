import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPaymentRequest } from 'src/app/@core/models/request/add-payment-request';
import { WashOrder } from 'src/app/@core/models/wash-order';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {

  paymentForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  washOrder: WashOrder | null = null;

  constructor(private _clientService: ClientService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) {

  }

  ngOnInit(): void {
    this.washOrder = this._config.data?.washOrder;
    this.initializeForm();
  }

  initializeForm(): void {
    this.paymentForm = new FormGroup({
      date: new FormControl<Date>(new Date(), []),
      amount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    });
  }

  onSubmitForm(paymentFormValue: any): void {
    if (!this.washOrder) {
      this._ref.close(false);
      return;
    }

    this.formProcessEvent.emit(true);

    const payment: AddPaymentRequest = paymentFormValue;
    const washOrderId = this.washOrder.id;
    const clientId = this.washOrder.client_id;

    this._clientService.addPayment(clientId, washOrderId, payment)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Cliente creado con éxito' });
        this._ref.close(true);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.paymentForm, err.error.errors);
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
