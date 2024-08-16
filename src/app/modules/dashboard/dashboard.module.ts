import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { AbilityModule } from '@casl/angular';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    AbilityModule,
    DashboardRoutingModule,
    ProgressBarModule
  ]
})
export class DashboardModule { }
