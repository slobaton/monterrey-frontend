import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashOrderDetail } from 'src/app/@core/models/wash-order';

import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClothSizeService } from 'src/app/@core/services/rest/cloth-size.service';
import { ClothTypeService } from 'src/app/@core/services/rest/cloth-type.service';

@Component({
  selector: 'app-add-wash-order-detail',
  templateUrl: './add-wash-order-detail.component.html',
  styleUrls: ['./add-wash-order-detail.component.scss']
})
export class AddWashOrderDetailComponent implements OnInit {

  washOrderDetailForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public clothTypeService: ClothTypeService,
    public clothSizeService: ClothSizeService,
    private _messageService: MessageService,
    private _ref: DynamicDialogRef,
    private _config: DynamicDialogConfig,
    private _validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
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
      is_special_wash: new FormControl<boolean>(false, [Validators.required]),
      wash_price: new FormControl<number>(0, [Validators.required]),
      quantity: new FormControl<number>(0, [Validators.required]),
      num_buttonholes: new FormControl<number>(0, [Validators.required]),
      observations: new FormControl<string>('', [])
    });
  }

  onSubmitForm(formValue: any): void {
    this.formProcessEvent.emit(true);

    const washOrderDetail: WashOrderDetail = formValue;
    this._ref.close({ detailAdded: true, detail: washOrderDetail });

    this.formProcessEvent.emit(false)
  }

}
