import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxGaugeModule } from 'ngx-gauge';


import { SharedModule } from '../shared/shared.module';
import { CbstRoutingModule } from './cbst-routing.module';

import { CbstMainComponent } from './cbst-main/cbst-main.component';
import { CbstDashboardComponent } from './cbst-dashboard/cbst-dashboard.component';
import { CbstAnalyticsComponent } from './cbst-analytics/cbst-analytics.component';
import { CbstSettingsComponent } from './cbst-settings/cbst-settings.component';
import { CbstTankComponent } from './cbst-tank/cbst-tank.component';


@NgModule({
  declarations: [
    CbstMainComponent,
    CbstDashboardComponent,
    CbstAnalyticsComponent,
    CbstSettingsComponent,
    CbstTankComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CbstRoutingModule,
    NgxGaugeModule

  ]
})
export class CbstModule {}
