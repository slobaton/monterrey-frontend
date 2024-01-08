import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbilityService } from '@casl/angular';
import { ChargeParameter } from 'src/app/@core/models/charge-parameter';
import { ChargeParameterService } from 'src/app/@core/services/rest/charge-parameter.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpdateParameterFormComponent } from '../../components/update-parameter-form/update-parameter-form.component';
import { AppAbility } from 'src/app/@core/auth/ability';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';

@Component({
  selector: 'app-parameter-prices',
  templateUrl: './parameter-prices.component.html',
  styleUrls: ['./parameter-prices.component.scss']
})
export class ParameterPricesComponent extends ProtectedComponent implements OnInit {
  @ViewChild('paramTable') table!: DataTableComponent<ChargeParameter>;

  parameters: Array<ChargeParameter> = [];

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Código', propertyRef: 'name', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Descripción', propertyRef: 'description', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Precio (Bs.)', propertyRef: 'price', type: DataTableColumnType.TEXT, visible: true, sortable: false },
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
    public parameterService: ChargeParameterService,
    private _dialogService: DialogService
  ) {
    super(abilityService, authService);
  }

  ngOnInit(): void { }
}
