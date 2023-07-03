import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClothSizeListComponent } from './pages/cloth-size-list/cloth-size-list.component';

const routes: Routes = [
  { path: '', component: ClothSizeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClothSizeRoutingModule { }
