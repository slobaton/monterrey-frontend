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
import { ClientParameterValueListComponent } from './pages/client-parameter-value-list/client-parameter-value-list.component';
import { UpsertParameterValueComponent } from './components/upsert-parameter-value/upsert-parameter-value.component';
import { AbilityModule } from '@casl/angular';
import { ClientMovementListComponent } from './pages/client-movement-list/client-movement-list.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { WashOrderModule } from '../wash-order/wash-order.module';
import { MovementListTableComponent } from './components/movement-list-table/movement-list-table.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { AddDiscountComponent } from './components/add-discount/add-discount.component';
import { IncomeModule } from '../income/income.module';
import { ToolbarModule } from 'primeng/toolbar';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { TagModule } from 'primeng/tag';


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
    CalendarModule,
    WashOrderModule,
    TableModule,
    CheckboxModule,
    TooltipModule,
    ToolbarModule,
    TagModule,
    IncomeModule,
  ],
  declarations: [
    ClientListComponent,
    UpsertClientFormComponent,
    ClientWashTypePriceListComponent,
    UpsertWashTypePriceComponent,
    ClientEffectPriceListComponent,
    UpsertEffectPriceComponent,
    ClientParameterValueListComponent,
    UpsertParameterValueComponent,
    ClientMovementListComponent,
    MovementListTableComponent,
    AddPaymentComponent,
    AddDiscountComponent,
    PaymentInfoComponent
  ]
})
export class ClientModule { }
