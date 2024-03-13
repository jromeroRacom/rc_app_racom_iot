import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportAllComponent } from './support-all/support-all.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'support-all',
    pathMatch: 'full'
  },
  { path: 'support-all', component: SupportAllComponent },
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
export class SupportRoutingModule { }
