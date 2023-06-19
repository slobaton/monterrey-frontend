import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FormComponent } from './components/form/form.component';



@NgModule({
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  exports: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent
  ]
})
export class SharedModule { }
