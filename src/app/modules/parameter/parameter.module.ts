import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParameterRoutingModule } from './parameter-routing.module';
import { ParameterValuesComponent } from './pages/parameter-values/parameter-values.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateParameterFormComponent } from './components/update-parameter-form/update-parameter-form.component';


@NgModule({
  declarations: [
    ParameterValuesComponent,
    UpdateParameterFormComponent
  ],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule
  ]
})
export class ParameterModule { }
