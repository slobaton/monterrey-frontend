import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashOrder } from 'src/app/@core/models/wash-order';
import { WashOrderService } from 'src/app/@core/services/rest/wash-order.service';
import {
  DataTableActionStatus,
  DataTableColumnType,
  DataTableConfiguration,
  DataTableSelectionType
} from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

@Component({
  selector: 'app-wash-order-list',
  templateUrl: './wash-order-list.component.html',
  styleUrls: ['./wash-order-list.component.scss']
})
export class WashOrderListComponent {

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
      { title: 'Precio Total', propertyRef: 'total_price', sortable: true, type: DataTableColumnType.TEXT },
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
        callback: () => {
          this._router.navigate(['/wash-orders/new']);
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
        callback: (selectedRows) => {
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
                  this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' })
                });
            },
            reject: () => {
              this._messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' })
            }
          });
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
        callback: (selectedRows) => {
          const washOrderId = selectedRows[0].id;
        }
      }
    ]
  };

  constructor(
    public washOrderService: WashOrderService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _router: Router) { }
}
