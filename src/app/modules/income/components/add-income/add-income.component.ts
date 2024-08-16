import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddIncomeRequest } from 'src/app/@core/models/request/add-income-request';
import { DateService } from 'src/app/@core/services/common/date.service';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { IncomeService } from 'src/app/@core/services/rest/income.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {

  incomeForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  currencyRateValue: number = 0;

  amountCurrency: number = 0;

  isFallbackConcept: boolean = false;
  fallbackConceptValue: string = 'Otro';
  conceptOptions = [
    {
      value: 'Pago a Cuenta',
    },
    {
      value: this.fallbackConceptValue
    }
  ];

  constructor(private _incomeService: IncomeService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService,
    private _dateService: DateService) {

  }

  ngOnInit(): void {
    this.currencyRateValue = this._config.data?.currencyRate?.value;
    this.initializeForm();
  }

  initializeForm(): void {
    this.incomeForm = new FormGroup({
      receipt_number: new FormControl<number>(0, [Validators.required]),
      date: new FormControl<Date>(this._dateService.getCurrentDate(), []),
      amount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      concept: new FormControl<string>('', [Validators.required]),
      client_name: new FormControl<string>('', [])
    });

    this.incomeForm.get('amount')?.valueChanges.subscribe(() => this.onAmountChanged());
    this.incomeForm.get('concept')?.valueChanges.subscribe(() => this.onConceptChanged());
  }

  onSubmitForm(incomeFormValue: any): void {
    this.formProcessEvent.emit(true);

    const income: AddIncomeRequest = {
      ...incomeFormValue,
      date: incomeFormValue.date
        ? this._dateService.formatDate(incomeFormValue.date)
        : null
    };

    this._incomeService.addIncome(income)
      .then(() => {
        this._messageService.add({ severity: 'success', summary: 'Ingreso registrado!', detail: 'Ingreso registrado con éxito' });
        this._ref.close(true);
      })
      .catch((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.incomeForm, err.error.errors);
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
    const currentValue = this.incomeForm.get('amount')?.value;
    const convertedValue = currentValue * this.currencyRateValue;
    this.amountCurrency = convertedValue;
  }

  onAmountCurrencyChanged(amount?: number) {
    const currentValue = this.amountCurrency;
    const convertedValue = currentValue / this.currencyRateValue;
    this.incomeForm.get('amount')?.setValue(convertedValue);
  }

  onConceptChanged() {
    const currentValue = this.incomeForm.get('concept')?.value;

    if (this.isFallbackConcept) {
      return;
    }

    if (currentValue === this.fallbackConceptValue) {
      this.isFallbackConcept = true;
      this.incomeForm.get('concept')?.reset();
    }
  }

  onReceiptCanceled(event: any) {
    if (event) {
      this.incomeForm.get('receipt_number')?.reset();
    }
  }
}
