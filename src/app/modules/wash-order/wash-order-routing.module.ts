import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashOrderListComponent } from './pages/wash-order-list/wash-order-list.component';
import { WashOrderCreateComponent } from './pages/wash-order-create/wash-order-create.component';
import { WashOrderListByClientComponent } from './pages/wash-order-list-by-client/wash-order-list-by-client.component';

const routes: Routes = [
  { path: '', component: WashOrderListComponent },
  { path: 'new', component: WashOrderCreateComponent },
  { path: 'edit/:id', component: WashOrderCreateComponent },
  { path: ':clientId/client', component: WashOrderListByClientComponent },
  { path: ':clientId/new', component: WashOrderCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WashOrderRoutingModule { }
