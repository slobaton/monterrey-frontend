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

@Component({
  selector: 'app-add-wash-order-detail',
  templateUrl: './add-wash-order-detail.component.html',
  styleUrls: ['./add-wash-order-detail.component.scss']
})
export class AddWashOrderDetailComponent implements OnInit {

  washOrderDetailForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isCalcPrices: boolean = false;

  unitPrice: number = 0;
  subTotalPrice: number = 0;

  washOrderDetailCalcResult: WashOrderDetailCalcResult = new WashOrderDetailCalcResult(0, 0, 0, 0, 0, 0, 0);

  private readonly defaultDebounceTime = 500;

  private calculateRequest = new Subject<WashOrderDetailCalculateRequest>();

  constructor(
    public clothTypeService: ClothTypeService,
    public clothSizeService: ClothSizeService,
    public effectService: EffectService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _washOrderDetailService: WashOrderDetailService,
    private _validationService: ValidationService) { }

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

    if (!washOrderId) {
      this._messageService.add({ severity: 'error', summary: 'Error!', detail: 'La orden de lavado, no ha sido creada correctamente.' });
      this._ref.close({ detailAdded: false, detail: null });
      return;
    }

    this.washOrderDetailForm = new FormGroup({
      wash_order_id: new FormControl<string>(washOrderId, [Validators.required]),
      cloth_type_id: new FormControl<number | null>(null, [Validators.required]),
      cloth_size_id: new FormControl<number | null>(null, [Validators.required]),
      is_focalizado_active: new FormControl<boolean>(false, [Validators.required]),
      is_nevado_active: new FormControl<boolean>(false, [Validators.required]),
      quantity: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      num_buttonholes: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      buttonholes_price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      observations: new FormControl<string>('', []),
      effects: new FormControl<Array<string>>([], [])
    });
  }

  onSubmitForm(formValue: any): void {
    this.formProcessEvent.emit(true);

    const washOrderDetail: WashOrderDetailCreateRequest = { ...formValue };

    this._washOrderDetailService.create(washOrderDetail)
      .then((washOrderDetailCreated) => {
        this._messageService.add({
          severity: 'success',
          summary: `Detalle agregado.`,
          detail: 'Orden de Lavado creado con éxito.',
          life: 1500
        });
        this._ref.close({ detailAdded: true, detail: washOrderDetailCreated });
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
        this.formProcessEvent.emit(false);
      });
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
}
