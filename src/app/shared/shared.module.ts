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
import { MessageService } from 'primeng/api';
import { FormInputTextComponent } from './components/form-input-text/form-input-text.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormSwitchComponent } from './components/form-switch/form-switch.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { UserRoleDirective } from './directives/user-role.directive';



@NgModule({
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent,
    FormInputTextComponent,
    FormTextareaComponent,
    FormSwitchComponent,
    FormLabelComponent,
    UserRoleDirective
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
    InputTextareaModule,
    InputSwitchModule
  ],
  exports: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent,
    FormInputTextComponent,
    FormTextareaComponent,
    FormSwitchComponent,
    FormLabelComponent,
    UserRoleDirective
  ]
})
export class SharedModule { }
