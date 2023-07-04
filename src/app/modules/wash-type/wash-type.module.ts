import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { WashTypeRoutingModule } from './wash-type-routing.module';
import { WashTypeListComponent } from './pages/wash-type-list/wash-type-list.component';
import { UpsertWashTypeComponent } from './components/upsert-wash-type/upsert-wash-type.component';


@NgModule({
  declarations: [
    WashTypeListComponent,
    UpsertWashTypeComponent
  ],
  imports: [
    CommonModule,
    WashTypeRoutingModule,
    SharedModule
  ]
})
export class WashTypeModule { }
