import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { IncomeReceiptListComponent } from './pages/income-receipt-list/income-receipt-list.component';
import { IncomeListComponent } from './pages/income-list/income-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { AddIncomeComponent } from './components/add-income/add-income.component';
import { CancelIncomeReceiptComponent } from 'src/app/shared/components/isolated/cancel-income-receipt/cancel-income-receipt.component';
import { PaymentInfoComponent } from 'src/app/shared/components/isolated/payment-info/payment-info.component';


@NgModule({
  declarations: [
    IncomeReceiptListComponent,
    IncomeListComponent,
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
    CancelIncomeReceiptComponent,
    PaymentInfoComponent
  ]
})
export class IncomeModule { }
