import { Component, Input, OnInit } from '@angular/core';

// https://devdactic.com/horizontal-navigation-ionic-desktop/

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() displayBackArrow: boolean;

  constructor() {
  }
  ngOnInit(): void {}

}