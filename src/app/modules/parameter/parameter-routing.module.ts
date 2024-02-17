import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterValuesComponent } from './pages/parameter-values/parameter-values.component';

const routes: Routes = [
  { path: '', component: ParameterValuesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
