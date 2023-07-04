import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WashTypeListComponent } from './pages/wash-type-list/wash-type-list.component';
import { Role } from 'src/app/@core/enums/role.enum';
import { roleGuard } from 'src/app/@core/auth/role.guard';

const routes: Routes = [
  { path: '', component: WashTypeListComponent, canActivate: [roleGuard([Role.SECRETARY])] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WashTypeRoutingModule { }
