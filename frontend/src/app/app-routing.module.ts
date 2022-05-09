import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { AuthGuard } from './auth/guard';
import { ExpandwidthComponent } from './layouts/expandwidth/expandwidth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './modules/home/home.component';
import { ProfileComponent } from './modules/profile/profile.component';  
import { SheetListComponent } from './modules/sheets/sheet-list/sheet-list.component';
import { CreateSheetComponent } from './modules/sheets/create-sheet/create-sheet.component';


const routes:Routes = [
  {
    path:"",
    component:DefaultComponent, canActivate:[AuthGuard],
    children:[{
      path:"",
      component:HomeComponent
    },
    {
      path:"profile",
      component:ProfileComponent
    },
    {
      path:"sheets",
      component:SheetListComponent
    },
    {
      path:"sheets/new",
      component:CreateSheetComponent
    }
  
  ]
  },
  {
    path:'',
    component:ExpandwidthComponent,
    children:[{
      path:'login',
      component:LoginComponent
    }]
  },
  {
    path:'',
    component:ExpandwidthComponent,
    children:[{
      path:'signup',
      component:SignupComponent
    }]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule ], 
  providers:[AuthGuard]
})
export class AppRoutingModule { }
