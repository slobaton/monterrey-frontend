import { Component, ViewChild } from '@angular/core';
import { AbilityService } from '@casl/angular';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppAbility } from 'src/app/@core/auth/ability';
import { ProtectedComponent } from 'src/app/@core/models/common/protected-component';

import { IncomeReceipt } from 'src/app/@core/models/income-receipt';
import { AuthService } from 'src/app/@core/services/rest/auth.service';
import { IncomeReceiptService } from 'src/app/@core/services/rest/income-receipt.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { CancelIncomeReceiptComponent } from 'src/app/shared/components/isolated/cancel-income-receipt/cancel-income-receipt.component';

@Component({
  selector: 'app-income-receipt-list',
  templateUrl: './income-receipt-list.component.html',
  styleUrls: ['./income-receipt-list.component.scss']
})
export class IncomeReceiptListComponent extends ProtectedComponent {
  @ViewChild('incomeReceiptsTable') table!: DataTableComponent<IncomeReceipt>;

  ref: DynamicDialogRef | undefined;

  public tableConfig: DataTableConfiguration = {
    columns: [
      { title: 'Num.', propertyRef: 'id', sortable: true },
      { title: 'Fecha', propertyRef: 'date', sortable: true, type: DataTableColumnType.DATE },
      { title: 'Estado', propertyRef: 'status', type: DataTableColumnType.BADGE, customValue: (status) => IncomeReceipt.getFriendlyStatusName(status) },
      { title: 'Creado', propertyRef: 'created_at', sortable: true, type: DataTableColumnType.DATETIME },
      { title: 'Actualizado', propertyRef: 'updated_at', sortable: true, type: DataTableColumnType.DATETIME },
    ],
    identifierPropRef: 'id',
    selectionType: DataTableSelectionType.SINGLE,
    actions: [
      {
        title: 'Anular Recibo',
        tooltip: 'Anular número de recibo',
        icon: 'times',
        status: DataTableActionStatus.DANGER,
        selectionConfig: {
          isRequired: false
        },
        callback: () => {
          this.ref = this.dialogService.open(CancelIncomeReceiptComponent, { header: 'Anular Recibo de Ingreso', width: '50%' });
          this.ref.onClose.subscribe((result) => {
            if (result) {
              this.table.reset();
            }
          });
        }
      }
    ]
  };

  constructor(
    abilityService: AbilityService<AppAbility>,
    authService: AuthService,
    public incomeReceiptService: IncomeReceiptService,
    private dialogService: DialogService
  ) {
    super(abilityService, authService);
  }
}
