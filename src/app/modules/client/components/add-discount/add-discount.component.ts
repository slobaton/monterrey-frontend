import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddDiscountRequest } from 'src/app/@core/models/request/add-discount-request';
import { DateService } from 'src/app/@core/services/common/date.service';
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

  currencyRateValue: number = 0;

  amountCurrency: number = 0;

  constructor(private _clientService: ClientService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService,
    private _dateService: DateService) {

  }

  ngOnInit(): void {
    this.clientId = this._config.data?.clientId;
    this.currencyRateValue = this._config.data?.currencyRate?.value;
    this.initializeForm();
  }

  initializeForm(): void {
    this.discountForm = new FormGroup({
      concept: new FormControl<string>('', [Validators.required]),
      date: new FormControl<Date>(this._dateService.getCurrentDate(), []),
      amount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    });

    this.discountForm.get('amount')?.valueChanges.subscribe(() => this.onAmountChanged());
  }

  onSubmitForm(discountFormValue: any): void {
    if (!this.clientId) {
      this._ref.close(false);
      return;
    }

    this.formProcessEvent.emit(true);

    const discount: AddDiscountRequest = {
      ...discountFormValue,
      date: this._dateService.formatDate(discountFormValue.date)
    };

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

  onAmountChanged() {
    const currentValue = this.discountForm.get('amount')?.value;
    const convertedValue = currentValue * this.currencyRateValue;
    this.amountCurrency = convertedValue;
  }

  onAmountCurrencyChanged(amount?: number) {
    const currentValue = this.amountCurrency;
    const convertedValue = currentValue / this.currencyRateValue;
    this.discountForm.get('amount')?.setValue(convertedValue);
  }
}
