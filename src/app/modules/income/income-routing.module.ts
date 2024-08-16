import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeReceiptListComponent } from './pages/income-receipt-list/income-receipt-list.component';
import { IncomeListComponent } from './pages/income-list/income-list.component';

const routes: Routes = [
  { path: 'list', component: IncomeListComponent },
  { path: 'receipts', component: IncomeReceiptListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
