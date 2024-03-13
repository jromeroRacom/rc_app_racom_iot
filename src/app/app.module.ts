import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(es);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './components/shared/shared.module';
import { AngularMaterialModule } from './components/shared/material/angular-material.module';
import { LayoutModule } from './components/layout/layout.module';

import { WINDOW_PROVIDERS } from './core/service/window.service';
import { AuthInterceptor } from './global/interceptors/auth.interceptor';
import { ErrorInterceptor } from './global/interceptors/error.interceptor';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        AngularMaterialModule,
        LayoutModule,
        CarouselModule,
        MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'es-*' },
        WINDOW_PROVIDERS
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
