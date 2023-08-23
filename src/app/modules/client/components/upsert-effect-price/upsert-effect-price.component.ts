import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EffectPriceUpsertRequest } from 'src/app/@core/models/request/effect-price-upsert-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { EffectPriceService } from 'src/app/@core/services/rest/effect-price.service';
import { EffectService } from 'src/app/@core/services/rest/effect.service';

@Component({
  selector: 'app-upsert-effect-price',
  templateUrl: './upsert-effect-price.component.html',
  styleUrls: ['./upsert-effect-price.component.scss']
})
export class UpsertEffectPriceComponent {
  effectPriceForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  doesEffectPriceExists: boolean = false;

  constructor(
    public effectService: EffectService,
    private _effectPriceService: EffectPriceService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const effectPrice = this._config.data?.effectPrice;
    this.doesEffectPriceExists = effectPrice!!;

    this.effectPriceForm = new FormGroup({
      id: new FormControl<number | null>(effectPrice?.effect_price.id),
      effect_id: new FormControl<number | null>({
        value: effectPrice?.id,
        disabled: this.doesEffectPriceExists
      }, [Validators.required]),
      price: new FormControl<number>(effectPrice?.effect_price.price ?? 0, [Validators.required]),
    });
  }

  onSubmitForm(effectPriceFormValue: any): void {
    this.formProcessEvent.emit(true);
    const effectPrice: EffectPriceUpsertRequest = {
      price: effectPriceFormValue.price
    };
    const clientId = this._config.data.clientId;

    if (this._config.data?.effectPrice) {
      const effectId = effectPriceFormValue.effect_id ?? this._config.data?.effectPrice.id;
      const id = effectPriceFormValue.id;
      this._effectPriceService.updateEffectPrice(clientId, effectId, id, effectPrice)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Actualizado con éxito', detail: 'Precio actualizado con éxito' });
          this._ref.close(effectPrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.effectPriceForm, err.error.errors);
            } else {
              this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La acción no se pudo realizar, intente nuevamente...' });
            }
          } else {
            this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'Error inesperado, intente nuevamente...' });
          }
        })
        .finally(() => this.formProcessEvent.emit(false));
    } else {
      const effectId = effectPriceFormValue.effect_id;
      this._effectPriceService.assignEffectPrice(clientId, effectId, effectPrice)
        .then(() => {
          this._messageService.add({ severity: 'success', summary: 'Creado con éxito', detail: 'Precio asignado con éxito' });
          this._ref.close(effectPrice);
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.effectPriceForm, err.error.errors);
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
