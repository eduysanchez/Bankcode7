import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DividasComponent } from './dividas/dividas.component';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, DividasComponent, NavbarComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SiteModule { }
