import { Component, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { CancelIncomeReceiptRequest } from 'src/app/@core/models/request/cancel-income-receipt-request';
import { DateService } from 'src/app/@core/services/common/date.service';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { IncomeReceiptService } from 'src/app/@core/services/rest/income-receipt.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-cancel-income-receipt',
  templateUrl: './cancel-income-receipt.component.html',
  styleUrls: ['./cancel-income-receipt.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class CancelIncomeReceiptComponent {
  cancelReceiptForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private _incomeReceiptService: IncomeReceiptService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _validationService: ValidationService,
    private _dateService: DateService) {

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.cancelReceiptForm = new FormGroup({
      receipt_number: new FormControl<number>(0, [Validators.required]),
      canceled_reason: new FormControl<string>('', [Validators.required]),
      date: new FormControl<Date>(this._dateService.getCurrentDate(), []),
    });
  }

  onSubmitForm(cancelReceiptFormValue: any): void {
    this.formProcessEvent.emit(true);

    const cancelRequest: CancelIncomeReceiptRequest = {
      ...cancelReceiptFormValue,
      date: cancelReceiptFormValue.date
        ? this._dateService.formatDate(cancelReceiptFormValue.date)
        : null
    };

    this._incomeReceiptService.cancelReceipt(cancelRequest)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Recibo cancelado!', detail: 'Recibo cancelado con éxito' });
        this._ref.close(true);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.cancelReceiptForm, err.error.errors);
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
