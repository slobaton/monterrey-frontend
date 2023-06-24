import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectListComponent } from './pages/effect-list/effect-list.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { EffectRoutingModule } from './effect-routing.module';

@NgModule({
  declarations: [
    EffectListComponent,
  ],
  imports: [
    CommonModule,
    EffectRoutingModule,
    DynamicDialogModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
  ]
})
export class EffectModule { }
