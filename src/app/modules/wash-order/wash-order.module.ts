import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WashOrderRoutingModule } from './wash-order-routing.module';
import { WashOrderListComponent } from './pages/wash-order-list/wash-order-list.component';
import { WashOrderCreateComponent } from './pages/wash-order-create/wash-order-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AddWashOrderDetailComponent } from './components/add-wash-order-detail/add-wash-order-detail.component';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    WashOrderListComponent,
    WashOrderCreateComponent,
    AddWashOrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WashOrderRoutingModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    ScrollPanelModule,
    TableModule,
    TagModule
  ]
})
export class WashOrderModule { }
