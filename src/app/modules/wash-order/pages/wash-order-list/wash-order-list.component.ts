import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashOrder } from 'src/app/@core/models/wash-order';
import { WashOrderService } from 'src/app/@core/services/rest/wash-order.service';
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
import { AddPaymentComponent } from '../../../client/components/add-payment/add-payment.component';
import { AddDiscountComponent } from '../../../client/components/add-discount/add-discount.component';
import { PrintService } from 'src/app/@core/services/common/print.service';

@Component({
  selector: 'app-wash-order-list',
  templateUrl: './wash-order-list.component.html',
  styleUrls: ['./wash-order-list.component.scss']
})
export class WashOrderListComponent extends ProtectedComponent {

  @ViewChild('washOrderTable') table!: DataTableComponent<WashOrder>;

  ref: DynamicDialogRef | undefined;

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
        title: 'Precio Total ($)',
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
      {
        title: '# Impresiones',
        propertyRef: 'print_count',
        sortable: false,
        visible: this.hasAdminRole()
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
        hiddenFn: (selectedRows) => !this.ableTo('create', 'wash-order'),
        callback: () => {
          this._router.navigate(['/wash-orders/new']);
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
        hiddenFn: (selectedRows) => !this.ableTo('update', 'wash-order'),
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
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'wash-order'),
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
        hiddenFn: (selectedRows) => !this.ableTo('read', 'wash-order'),
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
        hiddenFn: (selectedRow) => {
          if (!selectedRow) {
            return false;
          }

          const washOrder = selectedRow;

          if (!this.ableTo('create', 'wash-order')) {
            return true;
          }

          if (washOrder.status !== OrderStatus.APPROVED) {
            return true;
          }

          if (this.hasReceptionistRole() && washOrder.print_count > 0) {
            return true;
          }

          return false;
        },
        callback: async (action, selectedRows) => {
          const washOrder = selectedRows[0];
          const reportUrl = await this._reportService.getWashOrderPrintReportUrl(washOrder.id);

          this._printService.printPdf(reportUrl, () => {
            this.washOrderService.getById(washOrder.id)
              .then((updatedWashOrder) => {
                washOrder.print_count = updatedWashOrder.print_count;
              })
              .catch((err) => {
                console.error(err);
              })
              .finally(() => action.loading = false);
          });
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
        hiddenFn: (selectedRow) => {
          if (selectedRow) {
            const washOrder = selectedRow;
            return washOrder.status !== OrderStatus.CREATED;
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
    public washOrderService: WashOrderService,
    private _reportService: ReportService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _router: Router,
    private _printService: PrintService) {
    super(abilityService, authService);
  }
}
