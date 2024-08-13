import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeReceiptListComponent } from './pages/income-receipt-list/income-receipt-list.component';
import { IncomeListComponent } from './pages/income-list/income-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancelIncomeReceiptComponent } from './components/cancel-income-receipt/cancel-income-receipt.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AddIncomeComponent } from './components/add-income/add-income.component';


@NgModule({
  declarations: [
    IncomeReceiptListComponent,
    IncomeListComponent,
    CancelIncomeReceiptComponent,
    AddIncomeComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    SharedModule,
    FormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    TabViewModule,
  ],
  exports: [
    CancelIncomeReceiptComponent
  ]
})
export class IncomeModule { }
