import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashmainComponent } from './pages/dashmain/dashmain.component';
import { ValidateTokenGuard } from '../guardsupport/validate-token.guard';

const routes: Routes = [
  {
    path: '',
    component: DashmainComponent,
    canActivate: [ ValidateTokenGuard ],
    canLoad: [ ValidateTokenGuard ],
    children: [
      { path: 'inicio', component: DashboardComponent },
      { path: '**', redirectTo: 'inicio' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsupportRoutingModule { }
