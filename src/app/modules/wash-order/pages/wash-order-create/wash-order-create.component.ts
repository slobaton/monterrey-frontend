import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
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
import { ReportService } from 'src/app/@core/services/rest/report.service';
import { OrderStatus } from 'src/app/@core/enums/order-status.enum';
import { DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { UpsertClientFormComponent } from 'src/app/modules/client/components/upsert-client-form/upsert-client-form.component';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { AppAbility } from 'src/app/@core/auth/ability';
import { DateService } from 'src/app/@core/services/common/date.service';
import { PrintService } from 'src/app/@core/services/common/print.service';
import { ClientDataService } from 'src/app/@core/services/common/client-data.service';

@Component({
  selector: 'app-wash-order-create',
  templateUrl: './wash-order-create.component.html',
  styleUrls: ['./wash-order-create.component.scss']
})
export class WashOrderCreateComponent extends ProtectedComponent implements OnInit {

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

  reportLoading: boolean = false;

  washOrderDetailsLoading: boolean = false;
  washOrderDetails: Array<WashOrderDetail> = [];

  clientId: string = '';

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Nit', propertyRef: 'nit', sortable: true },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Ap. Paterno', propertyRef: 'paternal_surname', sortable: true },
      { title: 'Ap. Materno', propertyRef: 'maternal_surname', sortable: true },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE
  };

  onClientCreated: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public _route: ActivatedRoute,
    public _router: Router,
    public clientService: ClientService,
    public washTypeService: WashTypeService,
    private _washOrderService: WashOrderService,
    private _washOrderDetailService: WashOrderDetailService,
    private _reportService: ReportService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _validationService: ValidationService,
    private _clientDataService: ClientDataService,
    private _dialogService: DialogService,
    private _dateService: DateService,
    private _printService: PrintService) {
    super(abilityService, authService);
  }

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

            setTimeout(() => {
              this.onClientCreated.emit(washOrder.client);
            }, 500);
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
      this.initializeClient();
    })
  }

  initializeForm(): void {
    const todayDate = this._dateService.getCurrentDate();
    const existingDate = this.washOrder ? this._dateService.getDateFromString(this.washOrder.date) : null;

    this.washOrderForm = new FormGroup({
      client_id: new FormControl<string>(this.washOrder?.client_id || this.clientId || '', [Validators.required]),
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
      date: washOrderFormValue.date
        ? this._dateService.formatDate(washOrderFormValue.date)
        : null
    }

    this._washOrderService.create(washOrder)
      .then((createdWashOrder) => {
        this.code = createdWashOrder.code.toString();
        this.washOrderId = createdWashOrder.id;
        this.washOrder = createdWashOrder;
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
      date: washOrderFormValue.date
        ? this._dateService.formatDate(washOrderFormValue.date)
        : null
    }

    this._washOrderService.update(washOrder, this.washOrderId)
      .then(async (updatedWashOrder) => {
        this.code = updatedWashOrder.code.toString();
        this.washOrderId = updatedWashOrder.id;
        this.washOrderCreated = true;

        this.totalQuantity = updatedWashOrder.total_quantity;
        this.totalPrice = updatedWashOrder.total_price;

        this.retrieveWashOrderDetails();

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
    const clientId = this.washOrder?.client_id || this.clientId;

    const dialogProps = {
      header: 'Agregar Detalle de lavado',
      data: { washOrderId: this.washOrderId, clientId }
    };

    this.ref = this._dialogService.open(AddWashOrderDetailComponent, dialogProps);

    this.ref.onClose.subscribe(() => {
      this.retrieveWashOrderDetails();
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
    const clientId = this.washOrder?.client_id || this.clientId;

    const dialogProps = {
      header: 'Actualizar Detalle de Lavado',
      data: { washOrderId: this.washOrderId, clientId, washOrderDetailId, washOrderDetail }
    }

    this.ref = this._dialogService.open(AddWashOrderDetailComponent, dialogProps);

    this.ref.onClose.subscribe((result) => {
      if (result && result.detailSaved) {
        const updatedWashOrderDetail = result.detail as WashOrderDetail;

        const index = this.washOrderDetails.findIndex(x => x.id === updatedWashOrderDetail.id);

        if (index > -1) {
          this.washOrderDetails[index] = updatedWashOrderDetail;
          this.updateWashOrderTotal();
        }
      }
    });
  }

  async printOrder(): Promise<void> {
    if (this.washOrderId) {
      const washOrderId = this.washOrderId;
      this.reportLoading = true;

      const reportUrl = await this._reportService.getWashOrderPrintReportUrl(washOrderId);

      this._printService.printPdf(reportUrl, () => {
        this._washOrderService.getById(washOrderId)
          .then((updatedWashOrder) => {
            if (this.washOrder) {
              this.washOrder.print_count = updatedWashOrder.print_count;
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => this.reportLoading = false);
      });
    }
  }

  async approveOrder(): Promise<void> {
    if (this.washOrderId) {
      const washOrderId = this.washOrderId;
      this.reportLoading = true;

      this._confirmationService.confirm({
        key: 'confirm-action',
        header: 'Aprobar Orden',
        message: 'Una vez aprobado ya no se podrá actualizar, ¿Desea continuar?',
        accept: () => {
          this._washOrderService.approveById(washOrderId)
            .then((updatedWashOrder) => {
              this.washOrder = updatedWashOrder;

              this._messageService.add({
                severity: 'success',
                summary: `Orden COD: ${updatedWashOrder.code}`,
                detail: 'Orden de Lavado actualizada con éxito',
                life: 3500
              });
            })
            .catch(err => {
              if (err instanceof HttpErrorResponse) {
                this._messageService.add({
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'La acción no se pudo realizar, intente nuevamente...'
                });
              } else {
                this._messageService.add({
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Error inesperado, intente nuevamente...'
                });
              }
            })
            .finally(() => {
              this.reportLoading = false;
            });
        },
        reject: () => {
          this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
          this.reportLoading = false;
        }
      });


    }
  }

  getWashOrderStatus(): string {
    return WashOrder.getStatusFriendlyName(this.washOrder?.status ?? OrderStatus.UNKNOWN);
  }

  isReadyToApprove(): boolean {
    const status = this.washOrder?.status ?? 'unknown';

    return status === OrderStatus.CREATED;
  }

  isReadyToPrint(): boolean {
    const washOrder = this.washOrder;

    if (!washOrder) {
      return false;
    }

    const status = washOrder.status ?? 'unknown';

    if (status === 'unknown') {
      return false;
    }

    if (this.hasReceptionistRole() && washOrder.print_count > 0) {
      return false;
    }

    return status !== OrderStatus.CREATED;
  }

  showClientSelectedLabel(selectedClient: any) {
    return `${selectedClient.nit ?? ''} - ${selectedClient.name ?? ''} ${selectedClient.paternal_surname ?? ''} ${selectedClient.maternal_surname ?? ''}`;
  }

  openNewClientModal() {
    const dialogProps = {
      header: 'Nuevo Cliente'
    };

    this.ref = this._dialogService.open(UpsertClientFormComponent, dialogProps);

    this.ref.onClose.subscribe((createdClient) => {
      if (createdClient) {
        this.onClientCreated.emit(createdClient);
      }
    });
  }

  private retrieveWashOrderDetails() {
    this.washOrderDetailsLoading = true;
    this._washOrderDetailService.fetchPaginatedResource({
      filter: this.washOrderId,
      page: 1,
      pageSize: 1000,
      sort: '',
      sortOrder: ''
    }).then((result) => {
      this.washOrderDetails = result.data
      this.updateWashOrderTotal();
    }).catch(() => {
      this._messageService.add({
        severity: 'error',
        summary: 'Error inesperado',
        detail: 'Ocurrio un error inesperado, recargando...'
      });

      window.location.reload();
    }).finally(() => this.washOrderDetailsLoading = false);
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

  initializeClient() {
    const selectedClient = this._clientDataService.getData();

    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    });

    if (!selectedClient) {
      this.clientService.getById(this.clientId)
        .then((client) => {
          this._clientDataService.setData(client);
        })
        .catch(() => {
          this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
        })
    }

    if (this.clientId) {
      setTimeout(() => {
        this.onClientCreated.emit(this._clientDataService.getData());
      }, 500);
    }
  }
}
