import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Effect } from 'src/app/@core/models/effect';
import { WashOrderDetailCalculateRequest } from 'src/app/@core/models/request/wash-order-detail-calculate-request';
import { WashOrderDetailCreateRequest } from 'src/app/@core/models/request/wash-order-detail-create-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClothSizeService } from 'src/app/@core/services/rest/cloth-size.service';
import { ClothTypeService } from 'src/app/@core/services/rest/cloth-type.service';
import { EffectService } from 'src/app/@core/services/rest/effect.service';
import { WashOrderDetailService } from 'src/app/@core/services/rest/wash-order-detail.service';
import { WashOrderDetailCalcResult } from 'src/app/@core/models/wash-order-detail-calc-result';
import { WashOrderDetailUpdateRequest } from 'src/app/@core/models/request/wash-order-detail-update-request';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-add-wash-order-detail',
  templateUrl: './add-wash-order-detail.component.html',
  styleUrls: ['./add-wash-order-detail.component.scss']
})
export class AddWashOrderDetailComponent extends ProtectedComponent implements OnInit {

  washOrderDetailForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();
  isProcessing: boolean = false;
  isOnlyTimeSave: boolean = true;
  resetListPickerEvent: EventEmitter<void> = new EventEmitter();

  alreadySelectedItems: Array<Effect> = [];

  isCalcPrices: boolean = false;

  unitPrice: number = 0;
  subTotalPrice: number = 0;

  doesWashOrderDetailExists: boolean = false;

  private readonly defaultDebounceTime = 500;

  washOrderDetailCalcResult: WashOrderDetailCalcResult = new WashOrderDetailCalcResult(0, 0, 0, 0, 0, 0, 0, 0, 0);
  private calculateRequest = new Subject<WashOrderDetailCalculateRequest>();

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public clothTypeService: ClothTypeService,
    public clothSizeService: ClothSizeService,
    public effectService: EffectService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _washOrderDetailService: WashOrderDetailService,
    private _validationService: ValidationService) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this.initializeForm();

    this.washOrderDetailForm.valueChanges
      .subscribe((formValues) => this.updateCalcRequest(formValues));

    this.calculateRequest
      .pipe(debounceTime(this.defaultDebounceTime))
      .subscribe((request) => this.getWashOrderDetailPreCalc(request));

    this.updateCalcRequest(this.washOrderDetailForm.value);
  }

  initializeForm(): void {
    const washOrderId = this._config.data?.washOrderId;

    const washOrderDetail = this._config.data?.washOrderDetail;
    this.doesWashOrderDetailExists = washOrderDetail!!;

    if (!washOrderId) {
      this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La orden de lavado, no ha sido creada correctamente.' });
      this._ref.close({ detailAdded: false, detail: null });
      return;
    }

    this.alreadySelectedItems = washOrderDetail?.effects ?? [];
    const selectedEffects = this.alreadySelectedItems.map((effect: Effect) => effect.id);

    this.washOrderDetailForm = new FormGroup({
      wash_order_id: new FormControl<string>(washOrderId, [Validators.required]),
      cloth_type_id: new FormControl<number | null>(washOrderDetail?.cloth_type_id ?? null, [Validators.required]),
      cloth_size_id: new FormControl<number | null>(washOrderDetail?.cloth_size_id ?? null, [Validators.required]),
      is_focalizado_active: new FormControl<boolean>(washOrderDetail?.is_focalizado_active ?? false, [Validators.required]),
      is_nevado_active: new FormControl<boolean>(washOrderDetail?.is_nevado_active ?? false, [Validators.required]),
      quantity: new FormControl<number>(washOrderDetail?.quantity ?? 0, [Validators.required, Validators.min(0)]),
      num_buttonholes: new FormControl<number>(washOrderDetail?.num_buttonholes ?? 0, [Validators.required, Validators.min(0)]),
      observations: new FormControl<string>(washOrderDetail?.observations ?? '', []),
      effects: new FormControl<Array<string>>(selectedEffects, [])
    });
  }

  onSubmitForm(formValue: any): void {
    this.changeProcessState(true);

    if (!this.doesWashOrderDetailExists) {
      const washOrderDetail: WashOrderDetailCreateRequest = { ...formValue };

      this._washOrderDetailService.create(washOrderDetail)
        .then((washOrderDetailCreated) => {
          this._messageService.add({
            severity: 'success',
            summary: `Detalle agregado.`,
            detail: 'Detalle de Orden de Lavado creado con éxito.',
            life: 1500
          });
          this.processSuccessSubmit({ detailSaved: true, detail: washOrderDetailCreated });
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.washOrderDetailForm, err.error.errors);
            } else {
              this._messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'La acción no se pudo realizar, intente nuevamente...'
              });
            }
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Error inesperado, intente nuevamente...'
            });
          }
        })
        .finally(() => {
          this.changeProcessState(false);
        });
    } else {
      const washOrderDetailId = this._config.data?.washOrderDetailId;
      const washOrderDetail: WashOrderDetailUpdateRequest = { ...formValue };

      this._washOrderDetailService.update(washOrderDetailId, washOrderDetail)
        .then((washOrderDetailUpdated) => {
          this._messageService.add({
            severity: 'success',
            summary: `Detalle actualizado.`,
            detail: 'Detalle de Orden de Lavado actualizado con éxito.',
            life: 1500
          });
          this.processSuccessSubmit({ detailSaved: true, detail: washOrderDetailUpdated });
        })
        .catch(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 422) {
              this._validationService.handleValidationErrors(this.washOrderDetailForm, err.error.errors);
            } else {
              this._messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: 'La acción no se pudo realizar, intente nuevamente...'
              });
            }
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: 'Error inesperado, intente nuevamente...'
            });
          }
        })
        .finally(() => {
          this.changeProcessState(false);
        });
    }
  }

  onEffectSelection(selectedEffects: Array<Effect>): void {
    const selectedEffectIds = selectedEffects.map(effect => effect.id);
    this.washOrderDetailForm.get('effects')?.setValue(selectedEffectIds);
  }

  updateCalcRequest(formValues: any) {
    const request: WashOrderDetailCalculateRequest = { ...formValues };
    this.calculateRequest.next(request);
  }

  async getWashOrderDetailPreCalc(request: WashOrderDetailCalculateRequest) {
    this.isCalcPrices = true;

    const result = await this._washOrderDetailService.calculatePrices(request);

    this.isCalcPrices = false;

    this.washOrderDetailCalcResult = result;
  }

  setOnlyTimeSave(isOnlyTimeSave: boolean = true) {
    this.isOnlyTimeSave = isOnlyTimeSave;
  }

  private processSuccessSubmit(message: any) {
    if (this.isOnlyTimeSave) {
      this._ref.close(message);
    } else {
      const washOrderId = this._config.data?.washOrderId;

      this.washOrderDetailForm.reset({
        wash_order_id: washOrderId,
        is_focalizado_active: false,
        is_nevado_active: false,
        num_buttonholes: 0,
        quantity: 0
      });

      this.resetListPickerEvent.emit();
    }
  }

  private changeProcessState(state: boolean) {
    this.formProcessEvent.emit(state);
    this.isProcessing = state;
  }
}
