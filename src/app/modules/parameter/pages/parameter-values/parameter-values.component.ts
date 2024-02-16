import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbilityService } from '@casl/angular';
import { SystemParameter } from 'src/app/@core/models/system-parameter';
import { SystemParameterService } from 'src/app/@core/services/rest/system-parameter.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpdateParameterFormComponent } from '../../components/update-parameter-form/update-parameter-form.component';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';

@Component({
  selector: 'app-parameter-values',
  templateUrl: './parameter-values.component.html',
  styleUrls: ['./parameter-values.component.scss']
})
export class ParameterValuesComponent extends ProtectedComponent implements OnInit {
  @ViewChild('paramTable') table!: DataTableComponent<SystemParameter>;

  parameters: Array<SystemParameter> = [];

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Nombre', propertyRef: 'name', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Descripción', propertyRef: 'description', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Valor', propertyRef: 'value', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Actualizado', propertyRef: 'updated_at', type: DataTableColumnType.DATETIME, visible: true, sortable: false }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Editar',
        tooltip: 'Editar parametro',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        hiddenFn: (selectedRows) => !this.ableTo('manage', 'parameter'),
        callback: (action, selectedRows) => {
          const parameter = selectedRows[0];
          this.ref = this._dialogService.open(UpdateParameterFormComponent, { header: 'Actualizar Parametro', data: { parameter } });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      }
    ]
  }

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public parameterService: SystemParameterService,
    private _dialogService: DialogService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void { }
}
