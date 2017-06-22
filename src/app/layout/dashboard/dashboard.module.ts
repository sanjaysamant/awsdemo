import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TabViewModule,ButtonModule,GrowlModule,DialogModule} from 'primeng/primeng';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FileUploadModule,MultiSelectModule} from 'primeng/primeng';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {Ng2DragDropModule} from "ng2-drag-drop";
@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,FileUploadModule,
        TabViewModule,ButtonModule,GrowlModule,DialogModule,FormsModule,ReactiveFormsModule,
        SlimLoadingBarModule.forRoot(),MultiSelectModule,Ng2DragDropModule
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }
