import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from '../../app-routing.module';

// import { ClickOutsideModule } from 'ng-click-outside';
import { NgClickOutsideDirective } from 'ng-click-outside2'
import { SharedModule } from '../shared/shared.module';

import { AuthLayoutComponent } from './app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app-layout/main-layout/main-layout.component';
import { HeaderComponent } from '../layout/header/header.component';
import { PageLoaderComponent } from '../layout/page-loader/page-loader.component';
import { RightSidebarComponent } from '../layout/right-sidebar/right-sidebar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { IdleComponent } from '../shared/idle/idle.component';
import { SupportLayoutComponent } from './app-layout/support-layout/support-layout.component';
import { HeaderSupportComponent } from './header-support/header-support.component';
import { FooterSupportComponent } from './footer-support/footer-support.component';
import { AuthsupportLayoutComponent } from './app-layout/authsupport-layout/authsupport-layout.component';
import { DashboardLayoutComponent } from './app-layout/dashboard-layout/dashboard-layout.component';
import { HeaderdashbSupportComponent } from './headerdashb-support/headerdashb-support.component';




export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    SupportLayoutComponent,
    HeaderComponent,
    PageLoaderComponent,
    RightSidebarComponent,
    SidebarComponent,
    HeaderSupportComponent,
    FooterSupportComponent,
    AuthsupportLayoutComponent,
    DashboardLayoutComponent,
    HeaderdashbSupportComponent,
  ],
  exports: [
    AuthLayoutComponent,
    MainLayoutComponent,
    SupportLayoutComponent,
    HeaderComponent,
    PageLoaderComponent,
    RightSidebarComponent,
    SidebarComponent,
    IdleComponent,
    HeaderSupportComponent,
    FooterSupportComponent,
    AuthsupportLayoutComponent,
    DashboardLayoutComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    MatTabsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    //ClickOutsideModule,
    NgClickOutsideDirective,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
  ]
})
export class LayoutModule {}
