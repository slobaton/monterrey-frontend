import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParameterRoutingModule } from './parameter-routing.module';
import { ParameterPricesComponent } from './pages/parameter-prices/parameter-prices.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateParameterFormComponent } from './components/update-parameter-form/update-parameter-form.component';


@NgModule({
  declarations: [
    ParameterPricesComponent,
    UpdateParameterFormComponent
  ],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule
  ]
})
export class ParameterModule { }
