import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecaptchaModule } from 'ng-recaptcha';
import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
  ],
  declarations: [ContactPage],
})
export class ContactPageModule {}
