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
          { path: 'inicio', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
          { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
          { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
          { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
          { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
          { path: 'users', canActivate: [roleGuard([Role.ADMIN])], loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
          { path: 'clients', loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
          { path: 'wash-types', loadChildren: () => import('./modules/wash-type/wash-type.module').then(m => m.WashTypeModule) },
          { path: 'effects', loadChildren: () => import('./modules/effect/effect.module').then(m => m.EffectModule) },
          { path: 'cloth-types', loadChildren: () => import('./modules/cloth-type/cloth-type.module').then(m => m.ClothTypeModule) },
          { path: 'cloth-sizes', loadChildren: () => import('./modules/cloth-size/cloth-size.module').then(m => m.ClothSizeModule) },
          { path: '', redirectTo: 'inicio', pathMatch: 'full' }
        ]
      },
      { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
      { path: 'authold', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
      { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
      { path: 'notfound', component: NotfoundComponent },
      { path: '**', redirectTo: '/notfound' },
    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
