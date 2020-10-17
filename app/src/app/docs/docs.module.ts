import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { DocsPageRoutingModule } from './docs-routing.module';
import { DocsPage } from './docs.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocsPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [DocsPage]
})
export class DocsPageModule {}
