import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './components/layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './components/layout/app-layout/main-layout/main-layout.component';
import { SupportLayoutComponent } from './components/layout/app-layout/support-layout/support-layout.component';
import { AuthGuard } from './global/guards/auth.guard';
import { AuthsupportLayoutComponent } from './components/layout/app-layout/authsupport-layout/authsupport-layout.component';
import { DashboardLayoutComponent } from './components/layout/app-layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [],
    canLoad: [],
    loadChildren: () =>
      import('./components/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'support',
    component: SupportLayoutComponent,
    canActivate: [],
    canLoad: [],
    loadChildren: () =>
      import('./components/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'support/auth',
    component: AuthsupportLayoutComponent,
    canActivate: [],
    canLoad: [],
    loadChildren: () =>
      import('./components/support/authsupport/authsupport.module').then( m => m.AuthsupportModule )
  },
  {
    path: 'support/dashboard',
    component: DashboardLayoutComponent,
    loadChildren: () =>
      import('./components/support/adminsupport/adminsupport.module').then( m => m.AdminsupportModule )
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./components/main/main.module').then(m => m.MainModule)
  },
  { path: '', redirectTo: 'app/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/page404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
