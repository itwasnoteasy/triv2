import { NavController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { LoginEmailPage } from '../login-email/login-email';

@Component({
  templateUrl: 'sign-up.html',
  selector: 'sign-up',
})

export class SignUpPage {
  error: any;
  form: any;

  constructor(private navCtrl: NavController,
    private loadingCtrl: LoadingController,
  ) {
    this.form = {
      email: '',
      password: ''
    }
  }

  openLoginPage(): void {
    this.navCtrl.push(LoginEmailPage);
  }

  register() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
  }
}
