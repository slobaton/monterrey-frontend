import { Component, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParameterValue } from 'src/app/@core/models/parameter-value';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpsertParameterValueComponent } from '../../components/upsert-parameter-value/upsert-parameter-value.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParameterValueService } from 'src/app/@core/services/rest/parameter-value.service';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';
import { AbilityService } from '@casl/angular';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';

@Component({
  selector: 'app-client-parameter-value-list',
  templateUrl: './client-parameter-value-list.component.html',
  styleUrls: ['./client-parameter-value-list.component.scss']
})
export class ClientParameterValueListComponent extends ProtectedComponent {
  @ViewChild('paramsTable') table!: DataTableComponent<ParameterValue>;

  public clientId: string = '';

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Id', propertyRef: 'id', sortable: true, visible: false },
      { title: 'Parametero', propertyRef: 'name', sortable: false },
      { title: 'Valor Original', propertyRef: 'value' },
      {
        title: 'Valor Cliente',
        propertyRef: 'parameter_value.value',
        type: DataTableColumnType.CUSTOM,
        customValue: (row: ParameterValue) => `${row.parameter_value.value}`
      }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Nuevo',
        tooltip: 'Nuevo valor de parametro',
        icon: 'plus',
        status: DataTableActionStatus.SUCCESS,
        selectionConfig: {
          isRequired: false
        },
        hiddenFn: (selectedRows) => !this.ableTo('create', 'parameter'),
        callback: () => {
          this.ref = this._dialogService.open(UpsertParameterValueComponent, { header: 'Asignar Valor', data: { clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Editar',
        tooltip: 'Editar valor de parametro',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('update', 'parameter'),
        callback: (action, selectedRows) => {
          const parameterValue = selectedRows[0];
          this.ref = this._dialogService.open(UpsertParameterValueComponent, { header: 'Editar Valor', data: { parameterValue, clientId: this.clientId } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      },
      {
        title: 'Eliminar',
        tooltip: 'Eliminar valor de parametro',
        icon: 'trash',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hasLoadingEnabled: true,
        hiddenFn: (selectedRows) => !this.ableTo('delete', 'parameter'),
        callback: (action, selectedRows) => {
          const parameterId = selectedRows[0].id;
          const valueId = selectedRows[0].parameter_value.id;
          this._confirmationService.confirm({
            key: 'confirmParameterValueDelete',
            accept: () => {
              this.parameterValueService.deleteParameterValue(this.clientId, parameterId, valueId)
                .then(() => {
                  this._messageService.add({
                    key: 'confirmParameterValueDelete',
                    severity: 'success',
                    summary: 'Eliminado!',
                    detail: 'El valor del parametro para el cliente ha sido eliminado!.'
                  });
                  this.table.reset();
                })
                .catch((err) => {
                  console.error(err);
                  this._messageService.add({ key: 'confirmParameterValueDelete', severity: 'error', summary: 'Error', detail: 'No se pudo completar la accion.' });
                })
                .finally(() => action.loading = false);
            },
            reject: () => {
              this._messageService.add({ key: 'confirmParameterValueDelete', severity: 'error', summary: 'Cancelado', detail: 'Operacion cancelada!' });
              action.loading = false
            }
          });
        }
      }
    ]
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    private _route: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _dialogService: DialogService,
    private _messageService: MessageService,
    public parameterValueService: ParameterValueService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.clientId = params['clientId'];
    })
  }
}
