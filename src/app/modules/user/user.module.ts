import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { UpsertUserComponent } from './components/upsert-user-form/upsert-user.component'
import { AssignRoleComponent } from "./components/assign-role-form/assign-role.component";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  declarations: [
    UserListComponent,
    UpsertUserComponent,
    AssignRoleComponent
  ]
})
export class UserModule { }
