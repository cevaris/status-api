import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ContactPage } from "../contact/contact.page";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ContactPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    return await modal.present();
  }
}
