import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChargeParameter } from 'src/app/@core/models/charge-parameter';
import { ChargeParameterService } from 'src/app/@core/services/rest/charge-parameter.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { UpdateParameterFormComponent } from '../../components/update-parameter-form/update-parameter-form.component';

@Component({
  selector: 'app-parameter-prices',
  templateUrl: './parameter-prices.component.html',
  styleUrls: ['./parameter-prices.component.scss']
})
export class ParameterPricesComponent implements OnInit {
  @ViewChild('paramTable') table!: DataTableComponent<ChargeParameter>;

  parameters: Array<ChargeParameter> = [];

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Código', propertyRef: 'name', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Descripción', propertyRef: 'description', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Precio', propertyRef: 'price', type: DataTableColumnType.TEXT, visible: true, sortable: false },
      { title: 'Actualizado', propertyRef: 'updated_at', type: DataTableColumnType.DATETIME, visible: true, sortable: false }
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Editar',
        tooltip: 'Editar efecto',
        icon: 'pencil',
        status: DataTableActionStatus.WARNING,
        selectionConfig: {
          maxSelectedRows: 1
        },
        callback: (selectedRows) => {
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
    public parameterService: ChargeParameterService,
    private _dialogService: DialogService
  ) { }

  ngOnInit(): void { }
}
