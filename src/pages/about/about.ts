import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private isHosting: boolean;
  private hostEmailAddress: string;

  constructor(public navCtrl: NavController) {
     this.isHosting = true;
  }

  join() {
    this.isHosting = false;
  }

  hostMode(mode) {
    this.navCtrl.push(HomePage, {
      data: mode,
      hostEmail: this.hostEmailAddress
    });
  }

}
