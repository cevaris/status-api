import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
