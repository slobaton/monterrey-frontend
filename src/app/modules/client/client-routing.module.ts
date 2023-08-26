import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientWashTypePriceListComponent } from './pages/client-wash-type-price-list/client-wash-type-price-list.component';
import { ClientEffectPriceListComponent } from './pages/client-effect-price-list/client-effect-price-list.component';
import { ClientParameterPriceListComponent } from './pages/client-parameter-price-list/client-parameter-price-list.component';

const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: ':clientId/wash-type-prices', component: ClientWashTypePriceListComponent },
  { path: ':clientId/effect-prices', component: ClientEffectPriceListComponent },
  { path: ':clientId/parameters', component: ClientParameterPriceListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
