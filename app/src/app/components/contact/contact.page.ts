import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";

export interface ContactData {
  email: string;
  name: string;
  message: string;
}

@Component({
  selector: "app-contact",
  templateUrl: "./contact.page.html",
  styleUrls: ["./contact.page.scss"],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,4}$"),
    ]),
    name: new FormControl("", [Validators.required]),
    message: new FormControl("", [Validators.required]),
  });

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm(form: any) {
    console.log(form);
    console.log(this.contactForm.value);

    // do the axios call; wait for response

    this.dismiss();
  }
}
