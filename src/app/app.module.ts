import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AbilityModule, AbilityService, AblePipe } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AuthInterceptor } from './@core/interceptors/auth-interceptor';
import { SharedModule } from './shared/shared.module';
import { ErrorInterceptor } from './@core/interceptors/error-interceptor';
import { UpsertEffectFormComponent } from './modules/effect/components/upsert-effect-form/upsert-effect-form.component';

import { ProductService } from './demo/service/product.service';
import { AppAbility } from './@core/auth/ability';

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent, UpsertEffectFormComponent
  ],
  imports: [
    AppRoutingModule,
    AbilityModule,
    AppLayoutModule,
    SharedModule,
    ToastModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: AppAbility },
    AbilityService,
    MessageService,
    ConfirmationService,
    DialogService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
