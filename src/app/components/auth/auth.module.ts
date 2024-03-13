import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';


import { SigninComponent } from './signin/signin.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { LockedComponent } from './locked/locked.component';
import { PageWaitComponent } from './page-wait/page-wait.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { SignupComponent } from './signup/signup.component';
import { ValidateUserComponent } from './validate-user/validate-user.component';
import { ValidateChangeComponent } from './validate-change/validate-change.component';
import { EventDialogComponent } from './signin/dialogs/event-dialog/event-dialog.component';
import { RegisterDialogComponent } from './signup/dialogs/register-dialog/register-dialog.component';
import { ForgotPassDialogComponent } from './forgot-pass/dialogs/forgot-pass-dialog/forgot-pass-dialog.component';


@NgModule({
  declarations: [
    SigninComponent, ForgotPassComponent, LockedComponent,
    PageWaitComponent, Page404Component, Page500Component,
    ResetPassComponent, SignupComponent,
    ValidateUserComponent,
    ValidateChangeComponent,
    EventDialogComponent,
    RegisterDialogComponent,
    ForgotPassDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
