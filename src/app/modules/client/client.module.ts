import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { UpsertClientFormComponent } from './components/upsert-client-form/upsert-client-form.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ClientWashTypePriceListComponent } from './pages/client-wash-type-price-list/client-wash-type-price-list.component';
import { UpsertWashTypePriceComponent } from './components/upsert-wash-type-price/upsert-wash-type-price.component';
import { ClientEffectPriceListComponent } from './pages/client-effect-price-list/client-effect-price-list.component';
import { UpsertEffectPriceComponent } from './components/upsert-effect-price/upsert-effect-price.component';
import { ClientParameterPriceListComponent } from './pages/client-parameter-price-list/client-parameter-price-list.component';
import { UpsertParameterPriceComponent } from './components/upsert-parameter-price/upsert-parameter-price.component';
import { AbilityModule } from '@casl/angular';
import { ClientMovementListComponent } from './pages/client-movement-list/client-movement-list.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    AbilityModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    DynamicDialogModule,
    CalendarModule
  ],
  declarations: [
    ClientListComponent,
    UpsertClientFormComponent,
    ClientWashTypePriceListComponent,
    UpsertWashTypePriceComponent,
    ClientEffectPriceListComponent,
    UpsertEffectPriceComponent,
    ClientParameterPriceListComponent,
    UpsertParameterPriceComponent,
    ClientMovementListComponent
  ]
})
export class ClientModule { }
