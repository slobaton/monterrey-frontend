import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashOrderListComponent } from './pages/wash-order-list/wash-order-list.component';
import { WashOrderCreateComponent } from './pages/wash-order-create/wash-order-create.component';
import { WashOrderInfoComponent } from './components/wash-order-info/wash-order-info.component';

const routes: Routes = [
  { path: '', component: WashOrderListComponent },
  { path: 'new', component: WashOrderCreateComponent },
  { path: 'edit/:id', component: WashOrderCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WashOrderRoutingModule { }
