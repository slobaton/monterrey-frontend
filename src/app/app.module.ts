import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { AuthInterceptor } from './@core/interceptors/auth-interceptor';
import { SharedModule } from './shared/shared.module';
import { ErrorInterceptor } from './@core/interceptors/error-interceptor';
import { UpsertEffectFormComponent } from './modules/effect/components/upsert-effect-form/upsert-effect-form.component';

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent, UpsertEffectFormComponent
  ],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    SharedModule,
    ToastModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService, DialogService,
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
