import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer.component';


@NgModule({
    imports: [CommonModule, IonicModule, RouterModule],
    exports: [FooterComponent],
    declarations: [FooterComponent]
})
export class FooterComponentModule { }
