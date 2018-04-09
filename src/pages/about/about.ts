import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JoinPage } from '../join/join';
import { ContactsPage } from '../contacts/contacts';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private isHosting: boolean;
  private phoneNumber: string;
  private requiredColor: string = 'primary';

  constructor(public navCtrl: NavController) {
     this.isHosting = false;
  }

  private blinkRequired() {
    this.requiredColor = 'danger'; 
    var blink = setInterval(() => {
      if(this.requiredColor == 'primary') {
      this.requiredColor = 'danger';  
      } else {
        this.requiredColor = 'primary';  
      }
    }, 175);

    setTimeout(() => {
      clearInterval(blink);
    }, 1100);
    
  }

  hostMode(mode) {
    if (this.phoneNumber != null 
      && this.phoneNumber !== undefined 
      && this.phoneNumber !== ''
    ) {
      if (!mode) {
        this.navCtrl.push(ContactsPage, { data: mode, phoneNumber: this.phoneNumber });
      } else {
        this.navCtrl.push(JoinPage, { data: mode, phoneNumber: this.phoneNumber });
      }
    } else {
      this.blinkRequired();
    }
  }
}
