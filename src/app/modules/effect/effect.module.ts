import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectListComponent } from './pages/effect-list/effect-list.component';

import { EffectRoutingModule } from './effect-routing.module';



@NgModule({
  declarations: [
    EffectListComponent,
  ],
  imports: [
    CommonModule,
    EffectRoutingModule
  ]
})
export class EffectModule { }
