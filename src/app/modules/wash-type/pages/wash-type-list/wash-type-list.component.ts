import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WashType } from 'src/app/@core/models/wash-type';
import { WashTypeService } from 'src/app/@core/services/rest/wash-type.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpsertWashTypeComponent } from '../../components/upsert-wash-type/upsert-wash-type.component';

@Component({
  selector: 'app-wash-type-list',
  templateUrl: './wash-type-list.component.html',
  styleUrls: ['./wash-type-list.component.scss']
})
export class WashTypeListComponent {
  @ViewChild('washTypeTable') table!: DataTableComponent<WashType>;

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: false, visible: false },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Precio', propertyRef: 'price', sortable: true },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo Tipo Lavado',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          this.ref = this.dialogService.open(UpsertWashTypeComponent, { header: 'Crear nuevo Tipo Lavado' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar Tipo Lavado',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (action, selectedRows) => {
          const washType = selectedRows[0];
          this.ref = this.dialogService.open(UpsertWashTypeComponent, { header: 'Editar Tipo lavado', data: { washType } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Tipo Lavado',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        callback: (action, selectedRows) => {
          const washTypeId = selectedRows[0].id;
          this.confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.washTypeService.deleteById(washTypeId)
                .then(() => {
                  this.messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'El tipo lavado ha sido eliminado!.' });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this.messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this.messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
              action.loading = false;
            }
          });
        }
      }
    ]
  };

  constructor(
    public washTypeService: WashTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService) { }
}
