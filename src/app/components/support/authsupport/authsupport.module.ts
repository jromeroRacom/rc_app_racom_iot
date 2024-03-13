import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';

import { AuthsupportRoutingModule } from './authsupport-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';


@NgModule({
  declarations: [RegisterComponent, MainComponent, LoginComponent],
  imports: [
    CommonModule,
    AuthsupportRoutingModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    AngularMaterialModule,
  ]
})
export class AuthsupportModule { }
