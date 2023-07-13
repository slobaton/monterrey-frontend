import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WashOrderRoutingModule } from './wash-order-routing.module';
import { WashOrderListComponent } from './pages/wash-order-list/wash-order-list.component';
import { WashOrderCreateComponent } from './pages/wash-order-create/wash-order-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    WashOrderListComponent,
    WashOrderCreateComponent
  ],
  imports: [
    CommonModule,
    WashOrderRoutingModule,
    SharedModule,
    ButtonModule
  ]
})
export class WashOrderModule { }
