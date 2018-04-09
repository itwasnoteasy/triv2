import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DataProvider } from '../providers/data';
import { AuthProvider } from '../providers/auth';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = AboutPage;
  user: any;
  isAppInitialized: boolean = false;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    protected data: DataProvider,
    protected auth: AuthProvider) {
    platform.ready().then(() => {
      this.user = {
        image: ''
      };
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.auth.getUserData().subscribe(data => {
        if (!this.isAppInitialized) {
          this.isAppInitialized = true;
        }
        this.user = data;
      }, err => {
        this.rootPage = AboutPage;
      });
    });
  }
}

