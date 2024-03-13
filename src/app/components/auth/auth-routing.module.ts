import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { LockedComponent } from './locked/locked.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { PageWaitComponent } from './page-wait/page-wait.component';
import { ValidateUserComponent } from './validate-user/validate-user.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { ValidateChangeComponent } from './validate-change/validate-change.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'locked', component: LockedComponent },
  { path: 'page404', component: Page404Component },
  { path: 'page500', component: Page500Component },
  { path: 'page-wait', component: PageWaitComponent },
  { path: 'validate/:token', component: ValidateUserComponent },
  { path: 'validate-change/:token', component: ValidateChangeComponent },
  { path: 'reset-pass/:token', component: ResetPassComponent },
  {
    path: '**',
    redirectTo: 'page404',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
