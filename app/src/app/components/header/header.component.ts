import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

// https://devdactic.com/horizontal-navigation-ionic-desktop/

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() displayBackArrow: boolean;

  constructor(private menu: MenuController) {
  }
  ngOnInit(): void {
    // this.menu.enable(true, 'first');
    // this.menu.open('first');
  }

  openFirst() {
    // this.menu.enable(true, 'first');
    // this.menu.open('first');
  }

}