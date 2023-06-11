import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { DataTableComponent } from './components/data-table/data-table.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';



@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class SharedModule { }
