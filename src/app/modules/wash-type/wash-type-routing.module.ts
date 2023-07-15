import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashTypeListComponent } from './pages/wash-type-list/wash-type-list.component';

const routes: Routes = [
  { path: '', component: WashTypeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WashTypeRoutingModule { }
