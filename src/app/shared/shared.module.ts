import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { DataTableComponent } from './components/data-table/data-table.component';



@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TooltipModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class SharedModule { }
