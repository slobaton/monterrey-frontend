import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPaymentRequest } from 'src/app/@core/models/request/add-payment-request';
import { DateService } from 'src/app/@core/services/common/date.service';
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

  clientId: string | null = null;

  constructor(private _clientService: ClientService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService,
    private _dateService: DateService) {

  }

  ngOnInit(): void {
    this.clientId = this._config.data?.clientId;
    this.initializeForm();
  }

  initializeForm(): void {
    this.paymentForm = new FormGroup({
      receipt_number: new FormControl<number>(0, [Validators.required]),
      date: new FormControl<Date>(this._dateService.getCurrentDate(), []),
      amount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    });
  }

  onSubmitForm(paymentFormValue: any): void {
    if (!this.clientId) {
      this._ref.close(false);
      return;
    }

    this.formProcessEvent.emit(true);

    const payment: AddPaymentRequest = paymentFormValue;
    const clientId = this.clientId;

    this._clientService.addPayment(clientId, payment)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Pago registrado!', detail: 'Pago registrado con éxito' });
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
