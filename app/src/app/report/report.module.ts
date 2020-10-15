import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { ReportPageRoutingModule } from './report-routing.module';
import { ReportPage } from './report.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [ReportPage]
})
export class ReportPageModule { }
