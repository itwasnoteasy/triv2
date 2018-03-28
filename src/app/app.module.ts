import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { FormsModule } from '@angular/forms';

import { ForgotPasswordPage } from '../pages/auth/forgot-password/forgot-password';
import { AuthPage } from '../pages/auth/home/home';
import { LoginEmailPage } from '../pages/auth/login-email/login-email';
import { SignUpPage } from '../pages/auth/sign-up/sign-up';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';

import { AngularFireModule } from 'angularfire2';

// Providers
import { DataProvider } from '../providers/data';
import { AuthProvider } from '../providers/auth';
import { AngularFireDatabaseModule, AngularFireDatabaseProvider } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuthProvider } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { AboutPage } from '../pages/about/about';
import { GameEndedPage } from '../pages/gameEnded/gameEnded';
import { JoinPage } from '../pages/join/join';

export const firebaseConfig = {
  apiKey: "AIzaSyB_pdGDEb7OuerjJT2gffoIOstB-Yv9HLY",
  authDomain: "socal-73dca.firebaseapp.com",
  databaseURL: "https://socal-73dca.firebaseio.com",
  storageBucket: "socal-73dca.appspot.com",
  messagingSenderId: "333331279538"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ForgotPasswordPage,
    AuthPage,
    LoginEmailPage,
    SignUpPage,
    TermsOfServicePage,
    GameEndedPage,
    JoinPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ForgotPasswordPage,
    AuthPage,
    LoginEmailPage,
    SignUpPage,
    HomePage,
    TermsOfServicePage,
    GameEndedPage,
    JoinPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    AuthProvider,
    AngularFireDatabaseProvider,
    AngularFireAuthProvider
  ]
})
export class AppModule {}
