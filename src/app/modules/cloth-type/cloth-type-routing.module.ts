import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClothTypeListComponent } from './pages/cloth-type-list/cloth-type-list.component';

const routes: Routes = [
  { path: '', component: ClothTypeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClothTypeRoutingModule { }
