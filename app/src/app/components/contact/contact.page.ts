import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ContactUs, postContactUs } from 'src/app/actions/contact';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,4}$'),
    ]),
    name: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });
  siteKey = environment.reCaptchaSiteKey;
  captchaPassed: boolean = false;

  private captchaResponse: string;

  constructor(private modalController: ModalController, private zone: NgZone) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  async submitForm() {
    const contactUs = {
      ...this.contactForm.value,
      captcha: this.captchaResponse,
    } as ContactUs;

    console.log(contactUs);

    try {
      await postContactUs(contactUs);
      this.dismiss();
      console.log('contact_us success');
    } catch (error) {
      console.log('contact_us failed', error);
    }
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captchaPassed = true;
      this.captchaResponse = response;
    });
  }
}