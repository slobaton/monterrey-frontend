import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { WashOrderCreateRequest } from 'src/app/@core/models/request/wash-order-create-request';
import { ValidationService } from 'src/app/@core/services/common/validation.service';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { WashOrderService } from 'src/app/@core/services/rest/wash-order.service';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';
import { AddWashOrderDetailComponent } from '../../components/add-wash-order-detail/add-wash-order-detail.component';
import { WashOrderDetail } from 'src/app/@core/models/wash-order';
import { WashOrderDetailService } from 'src/app/@core/services/rest/wash-order-detail.service';
import { PaginatedRequest } from 'src/app/@core/models/request/paginated-request';

@Component({
  selector: 'app-wash-order-create',
  templateUrl: './wash-order-create.component.html',
  styleUrls: ['./wash-order-create.component.scss']
})
export class WashOrderCreateComponent implements OnInit {

  washOrderForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isProcessing: boolean = false;

  washOrderCreated: boolean = false;

  washOrderId: string = '';
  code: string = '';

  totalQuantity: number = 0;
  totalPrice: number = 0;

  washOrderDetails: Array<WashOrderDetail> = [];

  ref: DynamicDialogRef | undefined;

  constructor(
    public clientService: ClientService,
    public washTypeService: WashTypeService,
    private _washOrderService: WashOrderService,
    private _washOrderDetailService: WashOrderDetailService,
    private _messageService: MessageService,
    private _validationService: ValidationService,
    private _dialogService: DialogService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const todayDate = new Date();

    this.washOrderForm = new FormGroup({
      client_id: new FormControl<string>('', [Validators.required]),
      wash_type_id: new FormControl<number | null>(null, [Validators.required]),
      date: new FormControl<Date>(todayDate, [Validators.required]),
      is_special_price: new FormControl<boolean>(false, [Validators.required]),
      observations: new FormControl<string>('', [])
    })
  }

  onSubmitForm(washOrderFormValue: any): void {
    this.formProcessEvent.emit(true);
    this.isProcessing = true;

    const washOrder: WashOrderCreateRequest = {
      ...washOrderFormValue,
      date: formatDate(washOrderFormValue.date, 'yyyy/MM/dd', 'en_US')
    }

    this._washOrderService.create(washOrder)
      .then((createdWashOrder) => {
        this.code = createdWashOrder.code.toString();
        this.washOrderId = createdWashOrder.id;
        this.washOrderCreated = true;

        this.totalQuantity = createdWashOrder.total_quantity;
        this.totalPrice = createdWashOrder.total_price;

        this._messageService.add({
          severity: 'success',
          summary: `Orden COD: ${createdWashOrder.code}`,
          detail: 'Orden de Lavado creado con éxito',
          life: 3500
        });
      })
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 422) {
            this._validationService.handleValidationErrors(this.washOrderForm, err.error.errors);
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
        this.isProcessing = false;
      });
  }

  addWashOrderDetail(): void {
    const dialogProps = {
      header: 'Agregar Detalle de lavado',
      data: { washOrderId: this.washOrderId }
    };

    this.ref = this._dialogService.open(AddWashOrderDetailComponent, dialogProps);

    this.ref.onClose.subscribe((result) => {
      if (result && result.detailAdded) {
        this.washOrderDetails.push(result.detail);
        this.updateWashOrderTotal();
      }
    });
  }

  deleteWashOrderDetail(washOrderDetailId: string): void {
    this._washOrderDetailService.deleteById(washOrderDetailId)
      .then(() => {
        this.washOrderDetails = this.washOrderDetails.filter((x) => x.id !== washOrderDetailId);
        this.updateWashOrderTotal();
        this._messageService.add({
          severity: 'success',
          summary: 'Eliminado!',
          detail: 'Detalle de orden de lavado eliminado con exito...'
        });
      })
  }

  private updateWashOrderTotal() {
    let totalPrice = 0;
    let totalQuantity = 0;
    this.washOrderDetails.forEach(x => {
      totalPrice += x.subtotal_price;
      totalQuantity += x.quantity;
    });

    this.totalPrice = totalPrice;
    this.totalQuantity = totalQuantity;
  }
}
