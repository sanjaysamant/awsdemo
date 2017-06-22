import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CustomFormsModule } from 'ng2-validation';
//import {MultiSelectModule} from 'primeng/primeng';

//// Custom Module Import /////
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

//Custom Service//



@NgModule({
  declarations: [
    AppComponent
      ],
  
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomFormsModule,
  //  MultiSelectModule
   ],

  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
