import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

// Providers
import { DataProvider } from './data';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthProvider {
  user: any;
  constructor(private afAuth: AngularFireAuth, 
    private data: DataProvider, 
    private afDb: AngularFireDatabase,
    private platform: Platform,
    private googlePlus: GooglePlus) { }

  getUserData() {
    return Observable.create(observer => {
      this.afAuth.authState.subscribe(authData => {
        if (authData) {
          this.data.object('users/' + authData.uid).subscribe(userData => {
            this.user = userData;
            observer.next(userData);
          });
        } else {
          observer.error();
        }
      });
    });
  }


  loginWithGoogle() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.googlePlus.login({
          'webClientId': '198079995165-2l3qufrukqbt59595uuiu5lnfll6meln.apps.googleusercontent.com'
        }).then(googleData => {
          console.log(googleData);
          this.afDb.list('users').update(googleData.userId, {
            uid: googleData.userId,
            name: googleData.displayName,
            email: googleData.email,
            provider: 'google',
            image: googleData.imageUrl
          });
          observer.next(googleData);
        }, error => {
          observer.error(error);
        });
      } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        this.afAuth.auth.signInWithPopup(provider).then((googleData) => {
          this.afDb.list('users').update(googleData.user.uid, {
            uid: googleData.user.uid,
            name: googleData.user.displayName,
            email: googleData.user.email,
            provider: 'google',
            image: googleData.user.photoURL
          });
          observer.next(googleData.user);
        }).catch((error) => {
          observer.error(error);
        });
      }
    });
  }


  sendPasswordResetEmail(email) {
    return Observable.create(observer => {
      firebase.auth().sendPasswordResetEmail(email).then(function () {
        observer.next();
        // Email sent.
      }, function (error) {
        observer.error(error);
        // An error happened.
      });
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
