import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeReceiptListComponent } from './pages/income-receipt-list/income-receipt-list.component';
import { IncomeListComponent } from './pages/income-list/income-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancelIncomeReceiptComponent } from './components/cancel-income-receipt/cancel-income-receipt.component';


@NgModule({
  declarations: [
    IncomeReceiptListComponent,
    IncomeListComponent,
    CancelIncomeReceiptComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    SharedModule
  ],
  exports: [
    CancelIncomeReceiptComponent
  ]
})
export class IncomeModule { }
