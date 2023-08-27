import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterPricesComponent } from './pages/parameter-prices/parameter-prices.component';

const routes: Routes = [
  { path: 'prices', component: ParameterPricesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
