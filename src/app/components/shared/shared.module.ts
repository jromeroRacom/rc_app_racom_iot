import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerModule } from 'ngx-spinner';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar-portable';

import { AngularMaterialModule } from './material/angular-material.module';
import { LoadingDialogComponent } from './dialogs/loading-dialog/loading-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { IdleComponent } from './idle/idle.component';
import { SessionAliasComponent } from './session-alias/session-alias.component';
import { SessionTokenComponent } from './session-token/session-token.component';
import { IdleDialogComponent } from './idle/dialogs/idle-dialog/idle-dialog.component';
import { ExpiredSessionDialogComponent } from './session-token/dialogs/expired-session-dialog/expired-session-dialog.component';
import { AddDeviceDialogComponent } from './dialogs/add-device-dialog/add-device-dialog.component';
import { MainDeviceComponent } from './main-device/main-device.component';
import { TankComponent } from './devices/tank/tank.component';
import { PermissiveDialogComponent } from './dialogs/permissive-dialog/permissive-dialog.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [
    LoadingDialogComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    IdleComponent,
    SessionAliasComponent,
    SessionTokenComponent,
    IdleDialogComponent,
    ExpiredSessionDialogComponent,
    AddDeviceDialogComponent,
    MainDeviceComponent,
    TankComponent,
    PermissiveDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgxSpinnerModule,
    PerfectScrollbarModule,
    AngularMaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgxSpinnerModule,
    AngularMaterialModule,
    IdleComponent,
    PerfectScrollbarModule,
    SessionAliasComponent,
    SessionTokenComponent,
    MainDeviceComponent,
    TankComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {}
