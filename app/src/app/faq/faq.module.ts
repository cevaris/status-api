import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { FaqPageRoutingModule } from './faq-routing.module';
import { FaqPage } from './faq.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [FaqPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FaqPageModule { }
