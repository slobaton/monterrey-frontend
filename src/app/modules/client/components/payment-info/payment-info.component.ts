import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CancelIncomeReceiptComponent } from 'src/app/modules/income/components/cancel-income-receipt/cancel-income-receipt.component';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent {
  @Input() currencyRateValue: number = 0;

  @Output() incomeReceiptCanceled: EventEmitter<boolean> = new EventEmitter();

  ref: DynamicDialogRef | undefined;

  constructor(
    private _dialogService: DialogService
  ) { }

  cancelReceipt() {
    this.ref = this._dialogService.open(CancelIncomeReceiptComponent, { header: 'Anular Recibo de Ingreso', width: '50%' });
    this.ref.onClose.subscribe((result) => {
      if (result) {
        this.incomeReceiptCanceled.emit(true);
      }
    });
  }
}
