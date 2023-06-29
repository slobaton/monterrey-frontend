import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { roleGuard } from 'src/app/@core/auth/role.guard';
import { Role } from 'src/app/@core/enums/role.enum';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [roleGuard([Role.ADMIN])] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
