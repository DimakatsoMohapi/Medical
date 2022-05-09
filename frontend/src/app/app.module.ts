import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Interceptor } from './auth/interceptor';
import { DefaultModule } from './layouts/default/default.module';
import { ExpandwidthModule } from './layouts/expandwidth/expandwidth.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DefaultModule,
    ExpandwidthModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:Interceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
