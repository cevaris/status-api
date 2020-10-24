import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  mailto: string; 

  constructor() {
    this.mailto = `mailto:${environment.contactUsEmail}?subject=StatusAPI: Contact us`;
  }

  ngOnInit() {}

  contactUs() {
    window.top.location.href = this.mailto;
  }
}
