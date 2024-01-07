import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbilityService } from '@casl/angular';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Client } from 'src/app/@core/models/client';
import { ClientService } from 'src/app/@core/services/rest/client.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { AppAbility } from 'src/app/@core/auth/ability';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { UpsertClientFormComponent } from '../../components/upsert-client-form/upsert-client-form.component';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent extends ProtectedComponent {

  @ViewChild('clientTable') table!: DataTableComponent<Client>;

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Nit', propertyRef: 'nit', sortable: true },
      { title: 'Nombre', propertyRef: 'name', sortable: true },
      { title: 'Ap. Paterno', propertyRef: 'paternal_surname', sortable: true },
      { title: 'Ap. Materno', propertyRef: 'maternal_surname', sortable: true },
      { title: 'Telefono', propertyRef: 'phone' },
      { title: 'Celular', propertyRef: 'cellphone' },
      { title: 'Activo', propertyRef: 'is_active', type: DataTableColumnType.BOOLEAN },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo Cliente',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: (selectedRows) => !this.ableTo('create', 'client'),
        callback: () => {
          this.ref = this._dialogService.open(UpsertClientFormComponent, { header: 'Crear nuevo Cliente' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar Cliente',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('update', 'client'),
        callback: (action, selectedRows) => {
          const client = selectedRows[0];
          this.ref = this._dialogService.open(UpsertClientFormComponent, { header: 'Crear nuevo Cliente', data: { client } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar Cliente',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'client'),
        callback: (action, selectedRows) => {
          const clientId = selectedRows[0].id;
          this._confirmationService.confirm({
            key: 'confirmDelete',
            accept: () => {
              this.clientService.deleteClient(clientId)
                .then(() => {
                  this._messageService.add({ key: 'confirmDelete', severity: 'success', summary: 'Eliminado!', detail: 'El cliente ha sido eliminado!.' });
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
              action.loading = false
            }
          });
        }
      },
      {
        title: 'Precios General',
        tooltip: 'Ver Precios General',
        icon: 'dollar',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => this.hasReceptionistRole(),
        callback: (action, selectedRows) => {
          const clientId = selectedRows[0].id;
          this._router.navigate([`clients/${clientId}/parameters`])
        }
      },
      {
        title: 'Precios Lavado',
        tooltip: 'Ver Precios Lavado',
        icon: 'dollar',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => this.hasReceptionistRole(),
        callback: (action, selectedRows) => {
          const clientId = selectedRows[0].id;
          this._router.navigate([`clients/${clientId}/wash-type-prices`])
        }
      },
      {
        title: 'Precios Efecto',
        tooltip: 'Ver Precios Efectos',
        icon: 'dollar',
        status: DataTableActionStatus.INFO,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => this.hasReceptionistRole(),
        callback: (action, selectedRows) => {
          const clientId = selectedRows[0].id;
          this._router.navigate([`clients/${clientId}/effect-prices`])
        }
      }
    ]
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public clientService: ClientService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _router: Router) {
    super(abilityService, authService);
  }
}
