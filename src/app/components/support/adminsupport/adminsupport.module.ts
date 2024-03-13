import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsupportRoutingModule } from './adminsupport-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashmainComponent } from './pages/dashmain/dashmain.component';


@NgModule({
  declarations: [DashboardComponent, DashmainComponent],
  imports: [
    CommonModule,
    AdminsupportRoutingModule
  ]
})
export class AdminsupportModule { }
