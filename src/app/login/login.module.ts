import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService }   from '../../services/translate';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule, SlimLoadingBarModule.forRoot() ],
    declarations: [LoginComponent, TranslatePipe],
    providers:    [ TRANSLATION_PROVIDERS, TranslateService ],

})
export class LoginModule { }
