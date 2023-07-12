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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FormComponent } from './components/form/form.component';
import { FormInputTextComponent } from './components/form-input-text/form-input-text.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { FormSwitchComponent } from './components/form-switch/form-switch.component';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { UserRoleDirective } from './directives/user-role.directive';
import { FormInputNumberComponent } from './components/form-input-number/form-input-number.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent,
    FormInputTextComponent,
    FormTextareaComponent,
    FormSwitchComponent,
    FormLabelComponent,
    UserRoleDirective,
    FormInputNumberComponent,
    FormSelectComponent
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
    InputSwitchModule,
    InputNumberModule,
    DropdownModule,
    NgSelectModule
  ],
  exports: [
    DataTableComponent,
    ConfirmDialogComponent,
    FormComponent,
    FormInputTextComponent,
    FormTextareaComponent,
    FormSwitchComponent,
    FormInputNumberComponent,
    FormLabelComponent,
    UserRoleDirective,
    FormSelectComponent
  ]
})
export class SharedModule { }
