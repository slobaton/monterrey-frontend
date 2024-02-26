import { Component, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashOrder } from 'src/app/@core/models/wash-order';
import {
  DataTableActionStatus,
  DataTableColumnType,
  DataTableConfiguration,
  DataTableSelectionType
} from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { WashOrderInfoComponent } from '../../components/wash-order-info/wash-order-info.component';
import { ReportService } from 'src/app/@core/services/rest/report.service';
import { OrderStatus } from 'src/app/@core/enums/order-status.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { Role } from 'src/app/@core/enums/role.enum';
import {WashOrderByClientService} from "../../../../@core/services/rest/wash-order-by-client.service";
import {ClientDataService} from "../../../../@core/services/common/client-data.service";
import {ClientService} from "../../../../@core/services/rest/client.service";

@Component({
  selector: 'app-wash-order-list',
  templateUrl: './wash-order-list-by-client.component.html',
  styleUrls: ['./wash-order-list-by-client.component.scss']
})
export class WashOrderListByClientComponent extends ProtectedComponent {

  @ViewChild('washOrderByClientTable') table!: DataTableComponent<WashOrder>;

  ref: DynamicDialogRef | undefined;
  title: string = '';
  clientId: string = '';

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: false, visible: false },
      { title: 'Codigo', propertyRef: 'code', sortable: true },
      { title: 'Fecha', propertyRef: 'date', sortable: true, type: DataTableColumnType.DATE },
      {
        title: 'Cliente',
        propertyRef: 'client.name',
        sortable: false,
        customValue: (washOrder: WashOrder) => `${washOrder.client.name} ${washOrder.client.paternal_surname}`,
        type: DataTableColumnType.CUSTOM
      },
      {
        title: 'T. Lavado',
        propertyRef: 'wash_type.name',
        sortable: false,
        customValue: (washOrder: WashOrder) => washOrder.wash_type.name,
        type: DataTableColumnType.CUSTOM
      },
      { title: 'Cantidad Total', propertyRef: 'total_quantity', sortable: true, type: DataTableColumnType.TEXT },
      {
        title: 'Precio Total (Bs.)',
        propertyRef: 'total_price',
        sortable: true,
        type: DataTableColumnType.TEXT,
        visible: !this.authService.hasRole(Role.RECEPTIONIST)
      },
      {
        title: 'Estado',
        propertyRef: 'status',
        sortable: false,
        customValue: (status) => WashOrder.getStatusFriendlyName(status),
        type: DataTableColumnType.BADGE
      },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nueva',
        tooltip: 'Nueva Orden de Lavado',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: () => !this.ableTo('create', 'wash-order'),
        callback: () => {
          this._router.navigate([`/wash-orders/${this.clientId}/new`]);
        }
      },
      {
        title: 'Actualizar',
        tooltip: 'Actualizar la Orden de Lavado',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: () => !this.ableTo('update', 'wash-order'),
        callback: (action, selectedRows) => {
          const washOrderId = selectedRows[0].id;
          this._router.navigate([`/wash-orders/edit/${washOrderId}`]);
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Orden de Lavado',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: () => !this.ableTo('delete', 'wash-order'),
        callback: (action, selectedRows) => {
          const washOrderId = selectedRows[0].id;

          this._confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.washOrderService.deleteById(washOrderId)
                .then(() => {
                  this._messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'La order de lavado ha sido eliminado!.' });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
              action.loading = false;
            }
          });
        }
      },
      {
        title: 'Detalles',
        tooltip: 'Ver detalles de la orden de lavado',
        icon: 'eye',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: () => !this.ableTo('read', 'wash-order'),
        callback: (action, selectedRows) => {
          const washOrderId = selectedRows[0].id;

          const dialogProps = {
            header: 'Detalles de la Orden de Lavado',
            data: { washOrderId }
          };

          this.ref = this._dialogService.open(WashOrderInfoComponent, dialogProps);
        }
      },
      {
        title: 'Imprimir',
        tooltip: 'Imprimir Orden de Lavado',
        icon: 'print',
        status: DataTableActionStatus.PRIMARY,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedWashOrder) => {
          if (!this.ableTo('create', 'wash-order')) {
            return true;
          }

          if (selectedWashOrder) {
            return selectedWashOrder.status === OrderStatus.CREATED;
          }

          return false;
        },
        callback: async (action, selectedRows) => {
          const washOrderId = selectedRows[0].id;

          const reportUrl = await this._reportService.getWashOrderPrintReportUrl(washOrderId);

          action.loading = false;

          window.open(reportUrl);
        }
      },
      {
        title: 'Aprobar',
        tooltip: 'Aprobar Orden de Lavado',
        icon: 'check',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedWashOrder) => {
          if (this.authService.hasRole(Role.RECEPTIONIST)) {
            return true;
          }

          if (selectedWashOrder) {
            return selectedWashOrder.status !== OrderStatus.CREATED;
          }

          return false;
        },
        callback: async (action, selectedRows) => {
          const washOrder = selectedRows[0];

          this.washOrderService.approveById(washOrder.id)
            .then((updatedWashOrder) => {
              washOrder.status = updatedWashOrder.status;
              this._messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Orden Actualizada', detail: `Orden COD: ${washOrder.code} aprobada!` });
            })
            .catch((err) => {
              console.error(err);
              this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
            })
            .finally(() => action.loading = false);
        }
      }
    ]
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public washOrderService: WashOrderByClientService,
    private _reportService: ReportService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _clientDataService: ClientDataService,
    public _clientService: ClientService,
    private _route: ActivatedRoute,
    private _router: Router) {
    super(abilityService, authService);
  }

  initializeClient() {
    const selectedClient = this._clientDataService.getData();

    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    });

    if (!selectedClient) {
      this._clientService.getById(this.clientId)
        .then((client) => {
          this._clientDataService.setData(client);
          this.title = `Ordenes de lavado de: ${client.name || ''} ${client.paternal_surname || ''} ${client.maternal_surname || ''}`;
        })
        .catch(() => {
          this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
        })
    } else {
      this.title = `Ordenes de lavado de: ${selectedClient.name || ''} ${selectedClient.paternal_surname || ''} ${selectedClient.maternal_surname || ''}`
    }
  }

  ngOnInit(): void {
    this.initializeClient();
  }
}
