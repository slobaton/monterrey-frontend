import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DeniedComponent } from './pages/denied/denied.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'denied', component: DeniedComponent },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
