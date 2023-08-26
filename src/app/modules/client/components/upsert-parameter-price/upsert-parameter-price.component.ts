import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParameterPriceUpsertRequest } from 'src/app/@core/models/request/parameter-price-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ChargeParameterService } from 'src/app/@core/services/rest/charge-parameter.service';
import { ParameterPriceService } from 'src/app/@core/services/rest/parameter-price.service';

@Component({
  selector: 'app-upsert-parameter-price',
  templateUrl: './upsert-parameter-price.component.html',
  styleUrls: ['./upsert-parameter-price.component.scss']
})
export class UpsertParameterPriceComponent {
  parameterPriceForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesParameterPriceExists: boolean = false;

  constructor(
    public parameterService: ChargeParameterService,
    private _parameterPriceService: ParameterPriceService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const parameterPrice = this._config.data?.parameterPrice;
    this.doesParameterPriceExists = parameterPrice!!;

    this.parameterPriceForm = new FormGroup({
      id: new FormControl<number | null>(parameterPrice?.parameter_price.id),
      charge_parameter_id: new FormControl<number | null>({
        value: parameterPrice?.id,
        disabled: this.doesParameterPriceExists
      }, [Validators.required]),
      price: new FormControl<number>(parameterPrice?.parameter_price.price ?? 0, [Validators.required]),
    });
  }

  onSubmitForm(parameterPriceFormValue: any): void {
    this.formProcessEvent.emit(true);
    const parameterPrice: ParameterPriceUpsertRequest = {
      price: parameterPriceFormValue.price
    };
    const clientId = this._config.data.clientId;

    if (this._config.data?.parameterPrice) {
      const parameterId = parameterPriceFormValue.charge_parameter_id ?? this._config.data?.parameterPrice.id;
      const id = parameterPriceFormValue.id;
      this._parameterPriceService.updateParameterPrice(clientId, parameterId, id, parameterPrice)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Precio actualizado con éxito' });
          this._ref.close(parameterPrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.parameterPriceForm, err.error.errors);
            } else {
              this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      const parameterId = parameterPriceFormValue.charge_parameter_id;
      this._parameterPriceService.assignParameterPrice(clientId, parameterId, parameterPrice)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Precio asignado con éxito' });
          this._ref.close(parameterPrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.parameterPriceForm, err.error.errors);
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
}
