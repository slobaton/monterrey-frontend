import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { UpsertUserComponent } from './components/upsert-user-form/upsert-user.component'
import { AssignRoleComponent } from "./components/assign-role-form/assign-role.component";

import { CheckboxModule } from 'primeng/checkbox';
import {ReactiveFormsModule} from "@angular/forms";
import {ProgressBarModule} from "primeng/progressbar";
import {ChangePasswordComponent} from "./components/change-password-form/change-password.component";


@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule,
        CheckboxModule,
        ReactiveFormsModule,
        ProgressBarModule
    ],
  declarations: [
    UserListComponent,
    UpsertUserComponent,
    AssignRoleComponent,
    ChangePasswordComponent
  ]
})
export class UserModule { }
