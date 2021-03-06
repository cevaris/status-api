import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { PricingPageRoutingModule } from './pricing-routing.module';
import { PricingPage } from './pricing.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PricingPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [PricingPage]
})
export class PricingPageModule {}
