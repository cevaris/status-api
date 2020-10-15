import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header.component';


@NgModule({
    imports: [CommonModule, IonicModule, RouterModule],
    exports: [HeaderComponent],
    declarations: [HeaderComponent]
})
export class HeaderComponentModule { }
