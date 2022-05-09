import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { ProfileComponent } from 'src/app/modules/profile/profile.component'; 
import { CreateSheetComponent } from 'src/app/modules/sheets/create-sheet/create-sheet.component';
import { SheetListComponent } from 'src/app/modules/sheets/sheet-list/sheet-list.component';



@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent, 
    ProfileComponent,
    CreateSheetComponent,
    SheetListComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    ]
})
export class DefaultModule { }
