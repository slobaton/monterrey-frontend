import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClothTypeRoutingModule } from './cloth-type-routing.module';
import { ClothTypeListComponent } from './pages/cloth-type-list/cloth-type-list.component';
import { UpsertClothTypeComponent } from './components/upsert-cloth-type/upsert-cloth-type.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ClothTypeListComponent,
    UpsertClothTypeComponent
  ],
  imports: [
    CommonModule,
    ClothTypeRoutingModule,
    SharedModule
  ]
})
export class ClothTypeModule { }
