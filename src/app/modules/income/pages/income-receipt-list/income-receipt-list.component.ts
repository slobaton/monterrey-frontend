import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IncomeReceipt } from 'src/app/@core/models/income-receipt';
import { IncomeReceiptService } from 'src/app/@core/services/rest/income-receipt.service';
import { DataTableActionStatus, DataTableColumnType, DataTableConfiguration, DataTableSelectionType } from 'src/app/@core/types/data-table-definition';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

@Component({
  selector: 'app-income-receipt-list',
  templateUrl: './income-receipt-list.component.html',
  styleUrls: ['./income-receipt-list.component.scss']
})
export class IncomeReceiptListComponent {
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

          console.log('anular');
          // this.ref = this.dialogService.open(UpsertClothTypeComponent, { header: 'Crear nuevo Tipo Ropa' });
          // this.ref.onClose.subscribe((result) => {
          //   if (result) {
          //     this.table.reset();
          //   }
          // });
        }
      }
    ]
  };

  constructor(
    public incomeReceiptService: IncomeReceiptService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }
}
