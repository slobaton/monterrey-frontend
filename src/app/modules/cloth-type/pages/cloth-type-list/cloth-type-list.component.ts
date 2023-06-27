import { Component, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UpsertClothTypeComponent } from '../../components/upsert-cloth-type/upsert-cloth-type.component';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ClothTypeService } from 'src/app/@core/services/rest/cloth-type.service';
import { ClothType } from 'src/app/@core/models/cloth-type';

@Component({
  selector: 'app-cloth-type-list',
  templateUrl: './cloth-type-list.component.html',
  styleUrls: ['./cloth-type-list.component.scss']
})
export class ClothTypeListComponent {
  @ViewChild('clothTypeTable') table!: DataTableComponent<ClothType>;

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: false, visible: false },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo Tipo Ropa',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          this.ref = this.dialogService.open(UpsertClothTypeComponent, { header: 'Crear nuevo Tipo Ropa' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar Tipo Ropa',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedRows) => {
          const clothType = selectedRows[0];
          this.ref = this.dialogService.open(UpsertClothTypeComponent, { header: 'Editar Tipo de ropa', data: { clothType: clothType } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Tipo Ropa',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedRows) => {
          const clothTypeId = selectedRows[0].id;
          this.confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.clothTypeService.deleteById(clothTypeId)
                .then(() => {
                  this.messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'El tipo ropa ha sido eliminado!.' });
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
    public clothTypeService: ClothTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService) { }
}
