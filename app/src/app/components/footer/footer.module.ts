import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactUsComponentModule } from '../contact-us/contact-us.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, ContactUsComponentModule],
  exports: [FooterComponent],
  declarations: [FooterComponent],
})
export class FooterComponentModule {}
