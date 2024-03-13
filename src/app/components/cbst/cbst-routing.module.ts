import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CbstDashboardComponent } from './cbst-dashboard/cbst-dashboard.component';
import { CbstSettingsComponent } from './cbst-settings/cbst-settings.component';
import { CbstAnalyticsComponent } from './cbst-analytics/cbst-analytics.component';
import { CbstTankComponent } from './cbst-tank/cbst-tank.component';


const routes: Routes = [
  { path: 'dashboard', component: CbstDashboardComponent },
  { path: 'tank', component: CbstTankComponent },
  { path: 'analitycs', component: CbstAnalyticsComponent },
  { path: 'settings', component: CbstSettingsComponent },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbstRoutingModule {

}
