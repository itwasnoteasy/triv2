import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthPage } from '../auth/home/home'
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private user:any;
  constructor(public navCtrl: NavController,public auth: AuthProvider,) {
    this.user = auth.user;
  }

  public logout() {
    this.auth.logout();
    this.navCtrl.push(AuthPage);
  }

}
