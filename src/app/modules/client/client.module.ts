import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';

import { ClientListComponent } from './pages/client-list/client-list.component';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ],
  declarations: [
    ClientListComponent
  ]
})
export class ClientModule { }
