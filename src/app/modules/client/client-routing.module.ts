import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientWashTypePriceListComponent } from './pages/client-wash-type-price-list/client-wash-type-price-list.component';
import { ClientEffectPriceListComponent } from './pages/client-effect-price-list/client-effect-price-list.component';
import { ClientParameterPriceListComponent } from './pages/client-parameter-price-list/client-parameter-price-list.component';
import { roleGuard } from 'src/app/@core/auth/role.guard';
import { Role } from 'src/app/@core/enums/role.enum';
import { ClientMovementListComponent } from './pages/client-movement-list/client-movement-list.component';

const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: ':clientId/wash-type-prices', component: ClientWashTypePriceListComponent, canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])] },
  { path: ':clientId/effect-prices', component: ClientEffectPriceListComponent, canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])] },
  { path: ':clientId/parameters', component: ClientParameterPriceListComponent, canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])] },
  { path: ':clientId/movements', component: ClientMovementListComponent, canActivate: [roleGuard([Role.ADMIN, Role.RECEPTIONIST])] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
