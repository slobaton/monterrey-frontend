import { Component, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClothSize } from 'src/app/@core/models/cloth-size';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ClothSizeService } from 'src/app/@core/services/rest/cloth-size.service';
import { UpsertClothSizeComponent } from '../../components/upsert-cloth-size/upsert-cloth-size.component';

@Component({
  selector: 'app-cloth-size-list',
  templateUrl: './cloth-size-list.component.html',
  styleUrls: ['./cloth-size-list.component.scss']
})
export class ClothSizeListComponent {
  @ViewChild('clothSizeTable') table!: DataTableComponent<ClothSize>;

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: false, visible: false },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Descripción', propertyRef: 'description', sortable: false },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo Tamaño de Ropa',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          this.ref = this.dialogService.open(UpsertClothSizeComponent, { header: 'Crear nuevo Tamaño de Ropa' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar Tamaño de Ropa',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedRows) => {
          const clothSize = selectedRows[0];
          this.ref = this.dialogService.open(UpsertClothSizeComponent, { header: 'Editar Tamaño de ropa', data: { clothSize: clothSize } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Tamaño de Ropa',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedRows) => {
          const clothSizeId = selectedRows[0].id;
          this.confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.clothSizeService.deleteById(clothSizeId)
                .then(() => {
                  this.messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'El tamaño de ropa ha sido eliminado!.' });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this.messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' })
                });
            },
            reject: () => {
              this.messageService.add({ key: 'confirmDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' })
            }
          });
        }
      }
    ]
  };

  constructor(
    public clothSizeService: ClothSizeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService) { }
}
