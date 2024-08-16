import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { SharedModule } from 'src/app/shared/shared.module';

import { WashOrderRoutingModule } from './wash-order-routing.module';
import { WashOrderListComponent } from './pages/wash-order-list/wash-order-list.component';
import { WashOrderCreateComponent } from './pages/wash-order-create/wash-order-create.component';
import { AddWashOrderDetailComponent } from './components/add-wash-order-detail/add-wash-order-detail.component';
import { WashOrderInfoComponent } from './components/wash-order-info/wash-order-info.component';
import { WashOrderListByClientComponent } from './pages/wash-order-list-by-client/wash-order-list-by-client.component';

@NgModule({
  declarations: [
    WashOrderListComponent,
    WashOrderListByClientComponent,
    WashOrderCreateComponent,
    AddWashOrderDetailComponent,
    WashOrderInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    WashOrderRoutingModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    ScrollPanelModule,
    InputNumberModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ChipModule,
    OverlayPanelModule
  ],
  exports: [
    WashOrderInfoComponent
  ]
})
export class WashOrderModule { }
