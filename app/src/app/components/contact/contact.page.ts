import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { ContactUs, postContactUs } from "src/app/actions/contact";

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
  
  async submitForm() {
    console.log(this.contactForm.value);

    const contactUs = this.contactForm.value as ContactUs;

    try {
      await postContactUs(contactUs);
      this.dismiss();
      console.log("contact_us success");
    } catch (error) {
      console.log("contact_us failed", error);
    }
  }
}
