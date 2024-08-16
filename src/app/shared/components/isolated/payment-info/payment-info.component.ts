import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CancelIncomeReceiptComponent } from '../cancel-income-receipt/cancel-income-receipt.component';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
  standalone: true,
  imports: [
    ToolbarModule,
    TagModule,
    ButtonModule,
    CancelIncomeReceiptComponent,
  ]
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
