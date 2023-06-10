import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { DataTableComponent } from './components/data-table/data-table.component';



@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    DataTableComponent
  ]
})
export class SharedModule { }
