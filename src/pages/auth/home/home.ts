import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginEmailPage } from '../login-email/login-email';
import { SignUpPage } from '../sign-up/sign-up';
import { TermsOfServicePage } from '../../terms-of-service/terms-of-service';
import { AuthProvider } from '../../../providers/auth';

import { AboutPage } from '../../about/about';

@Component({
  templateUrl: 'home.html',
  selector: 'auth-home',
})

export class AuthPage {
  error: any;

  constructor(private navCtrl: NavController,
    private auth: AuthProvider,
    private platform: Platform) { }

  ngOnInit() {
      console.log('AuthPage..')
  }

  openSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

  openLoginPage() {
    this.navCtrl.push(LoginEmailPage);
  }

  openTermsOfService() {
    this.navCtrl.push(TermsOfServicePage);
  }

  loginUserWithGoogle() {
    this.auth.loginWithGoogle().subscribe(data => {
      console.log('log in with Google');
      console.log(data);
      if (this.platform.is('cordova')) {
        this.auth.user = {
          name: data.displayName,
          image: data.imageUrl,
          email: data.email,
          provider: 'google'
        };
      } else {
        this.auth.user = {
          name: data.displayName,
          image: data.photoURL,
          email: data.email,
          provider: 'google'
        };
      }
      console.log(this.auth.user);
      console.log('setting tabs page');
      this.navCtrl.setRoot(AboutPage);
    }, err => {
      this.error = err;
    });
  }
}
