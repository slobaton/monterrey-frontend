import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClothSizeRoutingModule } from './cloth-size-routing.module';
import { ClothSizeListComponent } from './pages/cloth-size-list/cloth-size-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpsertClothSizeComponent } from './components/upsert-cloth-size/upsert-cloth-size.component';


@NgModule({
  declarations: [
    ClothSizeListComponent,
    UpsertClothSizeComponent
  ],
  imports: [
    CommonModule,
    ClothSizeRoutingModule,
    SharedModule
  ]
})
export class ClothSizeModule { }
