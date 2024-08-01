import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeReceiptListComponent } from './pages/income-receipt-list/income-receipt-list.component';
import { IncomeListComponent } from './pages/income-list/income-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    IncomeReceiptListComponent,
    IncomeListComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    SharedModule
  ]
})
export class IncomeModule { }
