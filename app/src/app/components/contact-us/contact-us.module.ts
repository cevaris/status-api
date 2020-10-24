import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactUsComponent } from './contact-us.component';


@NgModule({
    imports: [CommonModule, IonicModule, RouterModule],
    exports: [ContactUsComponent],
    declarations: [ContactUsComponent]
})
export class ContactUsComponentModule { }
