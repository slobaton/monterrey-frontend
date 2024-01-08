import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Effect } from 'src/app/@core/models/effect';
import {
  DataTableActionStatus,
  DataTableColumnType,
  DataTableConfiguration,
  DataTableSelectionType
} from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpsertEffectFormComponent } from '../../components/upsert-effect-form/upsert-effect-form.component';
import { EffectService } from 'src/app/@core/services/rest/effect.service';
import { Role } from 'src/app/@core/enums/role.enum';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-effect-list',
  templateUrl: './effect-list.component.html',
  styleUrls: ['./effect-list.component.scss']
})
export class EffectListComponent extends ProtectedComponent {
  @ViewChild('effectTable') table!: DataTableComponent<Effect>;
  ref: DynamicDialogRef | undefined;
  role = Role;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: false, visible: false },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Precio (Bs.)', propertyRef: 'price', sortable: true },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo Efecto',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: (selectedRows) => !this.ableTo('create', 'effect'),
        callback: () => {
          this.ref = this.dialogService.open(UpsertEffectFormComponent, { header: 'Crear nuevo efecto' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar efecto',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('update', 'effect'),
        callback: (action, selectedRows) => {
          const effect = selectedRows[0];
          this.ref = this.dialogService.open(UpsertEffectFormComponent, { header: 'Crear nuevo efecto', data: { effect } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Usuario',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'effect'),
        callback: (action, selectedRows) => {
          const effectId = selectedRows[0].id;
          this.confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.effectService.deleteEffect(effectId)
                .then(() => {
                  this.messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'El efecto ha sido eliminado!.' });
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
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public effectService: EffectService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    super(abilityService, authService);
  }
}
