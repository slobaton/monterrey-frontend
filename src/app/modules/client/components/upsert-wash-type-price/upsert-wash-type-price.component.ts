import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashTypePriceUpsertRequest } from 'src/app/@core/models/request/wash-type-price-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { WashTypePriceService } from 'src/app/@core/services/rest/wash-type-price.service';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';

@Component({
  selector: 'app-upsert-wash-type-price',
  templateUrl: './upsert-wash-type-price.component.html',
  styleUrls: ['./upsert-wash-type-price.component.scss']
})
export class UpsertWashTypePriceComponent {
  washTypePriceForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesWashTypePriceExists: boolean = false;

  constructor(
    public washTypeService: WashTypeService,
    private _washTypePriceService: WashTypePriceService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const washTypePrice = this.config.data?.washTypePrice;
    this.doesWashTypePriceExists = washTypePrice!!;

    this.washTypePriceForm = new FormGroup({
      id: new FormControl<number | null>(washTypePrice?.wash_type_price.id),
      wash_type_id: new FormControl<number | null>({
        value: washTypePrice?.id,
        disabled: this.doesWashTypePriceExists
      }, [Validators.required]),
      price: new FormControl<number>(washTypePrice?.wash_type_price.price ?? 0, [Validators.required]),
    });
  }

  onSubmitForm(washTypePriceFormValue: any): void {
    this.formProcessEvent.emit(true);
    const washTypePrice: WashTypePriceUpsertRequest = {
      price: washTypePriceFormValue.price
    };
    const clientId = this.config.data.clientId;

    if (this.config.data?.washTypePrice) {
      const washTypeId = washTypePriceFormValue.wash_type_id ?? this.config.data?.washTypePrice.id;
      const id = washTypePriceFormValue.id;
      this._washTypePriceService.updateWashTypePrice(clientId, washTypeId, id, washTypePrice)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Cliente actualizado con éxito' });
          this.ref.close(washTypePrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.washTypePriceForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      const washTypeId = washTypePriceFormValue.wash_type_id;
      this._washTypePriceService.assignWashTypePrice(clientId, washTypeId, washTypePrice)
        .then(() => {
          this.messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Cliente creado con éxito' });
          this.ref.close(washTypePrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this.validationService.handleValidationErrors(this.washTypePriceForm, err.error.errors);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    }
  }
}
