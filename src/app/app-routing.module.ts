import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './@core/auth/auth.guard';
import { roleGuard } from './@core/auth/role.guard';
import { Role } from './@core/enums/role.enum';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'users', canActivate: [roleGuard([Role.ADMIN])], loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
          { path: 'clients', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY, Role.RECEPTIONIST])], loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
          { path: 'wash-types', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])], loadChildren: () => import('./modules/wash-type/wash-type.module').then(m => m.WashTypeModule) },
          { path: 'effects', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])], loadChildren: () => import('./modules/effect/effect.module').then(m => m.EffectModule) },
          { path: 'cloth-types', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])], loadChildren: () => import('./modules/cloth-type/cloth-type.module').then(m => m.ClothTypeModule) },
          { path: 'cloth-sizes', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY])], loadChildren: () => import('./modules/cloth-size/cloth-size.module').then(m => m.ClothSizeModule) },
          { path: 'wash-orders', canActivate: [roleGuard([Role.ADMIN, Role.SECRETARY, Role.RECEPTIONIST])], loadChildren: () => import('./modules/wash-order/wash-order.module').then(m => m.WashOrderModule) },
          { path: 'parameters', canActivate: [roleGuard([Role.ADMIN])], loadChildren: () => import('./modules/parameter/parameter.module').then(m => m.ParameterModule) },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
      { path: 'notfound', component: NotfoundComponent },
      { path: '**', redirectTo: '/notfound' },
    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload', useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
