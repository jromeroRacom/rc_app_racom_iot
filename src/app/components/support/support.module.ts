import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../shared/material/angular-material.module';
import { SupportRoutingModule } from './support-routing.module';

import { SupportAllComponent } from './support-all/support-all.component';


@NgModule({
  declarations: [SupportAllComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    SupportRoutingModule
  ],
  exports: [
    AngularMaterialModule
  ]
})
export class SupportModule { }
