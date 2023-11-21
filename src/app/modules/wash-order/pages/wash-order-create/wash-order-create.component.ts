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
import { WashOrder, WashOrderDetail } from 'src/app/@core/models/wash-order';
import { WashOrderDetailService } from 'src/app/@core/services/rest/wash-order-detail.service';
import { WashOrderUpdateRequest } from 'src/app/@core/models/request/wash-order-update-request';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wash-order-create',
  templateUrl: './wash-order-create.component.html',
  styleUrls: ['./wash-order-create.component.scss']
})
export class WashOrderCreateComponent implements OnInit {

  washOrderForm!: FormGroup;
  formProcessEvent: EventEmitter<boolean> = new EventEmitter();

  isProcessing: boolean = false;
  isDetailProcessing: boolean = false;

  washOrderCreated: boolean = false;
  existingWashOrder: boolean = false;
  washOrderLoaded: boolean = false;

  washOrderId: string = '';
  code: string = '';
  washOrder: WashOrder | null = null;

  totalQuantity: number = 0;
  totalPrice: number = 0;

  washOrderDetails: Array<WashOrderDetail> = [];

  ref: DynamicDialogRef | undefined;

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public clientService: ClientService,
    public washTypeService: WashTypeService,
    private _washOrderService: WashOrderService,
    private _washOrderDetailService: WashOrderDetailService,
    private _messageService: MessageService,
    private _validationService: ValidationService,
    private _dialogService: DialogService) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.washOrderId = params['id'];

      if (this.washOrderId) {
        this.washOrderCreated = true;
        this.existingWashOrder = true;

        this._washOrderService.getById(this.washOrderId)
          .then(async (washOrder) => {
            this.washOrder = washOrder;
            this.code = washOrder.code.toString();
            this.totalQuantity = washOrder.total_quantity;
            this.totalPrice = washOrder.total_price;
            this.washOrderDetails = (await this._washOrderDetailService.fetchPaginatedResource({
              filter: this.washOrderId,
              page: 1,
              pageSize: 1000,
              sort: '',
              sortOrder: ''
            })).data;
          })
          .catch((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 404) {
                this._messageService.add({
                  severity: 'error',
                  summary: `Orden invalida`,
                  detail: 'La Orden de Lavado es invalida o no existe',
                  life: 2000
                });
              }
            } else {
              this._messageService.add({
                severity: 'error',
                summary: `Error inesperado`,
                detail: 'Ocurrio un error inesperado al intentar obtener la order de lavado.',
                life: 2000
              });
            }

            setTimeout(() => {
              this._router.navigateByUrl('wash-orders');
            }, 2000);
          })
          .finally(() => {
            this.initializeForm();
          });
      }

      this.initializeForm();
    })
  }

  initializeForm(): void {
    const todayDate = new Date();
    const existingDate = this.washOrder ? new Date(this.washOrder.date) : null;

    this.washOrderForm = new FormGroup({
      client_id: new FormControl<string>(this.washOrder?.client_id ?? '', [Validators.required]),
      wash_type_id: new FormControl<number | null>(this.washOrder?.wash_type_id ?? null, [Validators.required]),
      date: new FormControl<Date>(existingDate ?? todayDate, [Validators.required]),
      is_special_price: new FormControl<boolean>(this.washOrder?.is_special_price ?? false, [Validators.required]),
      observations: new FormControl<string>(this.washOrder?.observations ?? '', [])
    });

    if (this.washOrder) {
      this.washOrderLoaded = true;
    }
  }

  onSubmitForm(washOrderFormValue: any): void {
    this.formProcessEvent.emit(true);
    this.isProcessing = true;

    if (!this.washOrderCreated && !this.washOrder) {
      this.saveWashOrder(washOrderFormValue);
    } else {
      this.updateWashOrder(washOrderFormValue);
    }
  }

  private saveWashOrder(washOrderFormValue: any) {
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

  private updateWashOrder(washOrderFormValue: any) {
    const washOrder: WashOrderUpdateRequest = {
      ...washOrderFormValue,
      date: formatDate(washOrderFormValue.date, 'yyyy/MM/dd', 'en_US')
    }

    this._washOrderService.update(washOrder, this.washOrderId)
      .then(async (updatedWashOrder) => {
        this.code = updatedWashOrder.code.toString();
        this.washOrderId = updatedWashOrder.id;
        this.washOrderCreated = true;

        this.totalQuantity = updatedWashOrder.total_quantity;
        this.totalPrice = updatedWashOrder.total_price;

        this.washOrderDetails = (await this._washOrderDetailService.fetchPaginatedResource({
          filter: this.washOrderId,
          page: 1,
          pageSize: 1000,
          sort: '',
          sortOrder: ''
        })).data;

        this._messageService.add({
          severity: 'success',
          summary: `Orden COD: ${updatedWashOrder.code}`,
          detail: 'Orden de Lavado actualizada con éxito',
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
    this.isDetailProcessing = true;
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
      .finally(() => this.isDetailProcessing = false);
  }

  updateWashOrderDetail(washOrderDetailId: string, washOrderDetail: WashOrderDetail): void {
    const dialogProps = {
      header: 'Actualizar Detalle de Lavado',
      data: { washOrderId: this.washOrderId, washOrderDetailId, washOrderDetail }
    }

    this.ref = this._dialogService.open(AddWashOrderDetailComponent, dialogProps);

    this.ref.onClose.subscribe((result) => {
      if (result && result.detailUpdated) {
        const updatedWashOrderDetail = result.detail as WashOrderDetail;

        const index = this.washOrderDetails.findIndex(x => x.id === updatedWashOrderDetail.id);

        if (index > -1) {
          this.washOrderDetails[index] = updatedWashOrderDetail;
        }
      }
    });
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
