import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { ListDevicesComponent } from './list-devices/list-devices.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { CbstMainComponent } from '../cbst/cbst-main/cbst-main.component';
import { AdminGuard } from '../../global/guards/admin.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'devices',
    component: ListDevicesComponent,
  },
  {
    path: 'devices/cbst/:serial',
    component: CbstMainComponent,
    canActivate: [],
    canLoad: [],
    loadChildren: () =>
      import('../cbst/cbst.module').then(m => m.CbstModule)
  },
  { path: 'account', component: AccountComponent },
  { path: 'black', component: BlankComponent },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    loadChildren: () =>
      import('../admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    redirectTo: 'devices',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
