import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpandwidthComponent } from './expandwidth.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { SignupComponent } from 'src/app/auth/signup/signup.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    ExpandwidthComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule
  ]
})
export class ExpandwidthModule { }
