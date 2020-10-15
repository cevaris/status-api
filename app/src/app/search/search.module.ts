import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '../components/header/header.module';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchPage } from './search.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
