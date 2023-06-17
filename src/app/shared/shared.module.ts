import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';



@NgModule({
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule
  ],
  exports: [
    DataTableComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
