import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-join',
  templateUrl: 'join.html'
})
export class JoinPage {
  private hostEmailAddress: string;
  private members: any[];
  private members$: any;
  private gameKey: string;
  private mode: boolean;
  private currentQuestionId: number;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private alertCtrl: AlertController,
    private auth: AuthProvider) {
    console.log(auth.user);
    this.mode = this.navParams.get('data');
    this.hostEmailAddress = this.navParams.get('hostEmail');
    var gameKey = this.hostEmailAddress.replace('@', 'at');
    gameKey = gameKey.replace('.', 'dot');
    gameKey = gameKey +'Game';
    this.gameKey = gameKey;
     // Game has begun so clear out all the values and set question = 0
     console.log('this.mode under join.ts: '+this.mode);
    if (this.mode) {
      this.afDatabase.object(this.gameKey).set('');
      this.afDatabase.object(this.gameKey + '/currentQuestionId').set(0);
      this.afDatabase.object(this.gameKey + '/isGameEnded').set(false);
    } else {
      this.afDatabase.object(this.gameKey + '/currentQuestionId').valueChanges()
        .subscribe((_questionId: number) => {
          this.currentQuestionId = _questionId;
        });
      this.setIsLate();
      this.showHomePage();
    }
    this.members$ = this.afDatabase.object(gameKey + '/members').snapshotChanges()
    .subscribe((_members: any) => {
      if(_members != null && _members != undefined) {
        this.members = [];
        var memberVals = _members.payload.val();
        if(memberVals != null && memberVals != undefined) {
          Object.keys(memberVals).forEach(key => {
            console.log(key);
            var imageUrl = this.afDatabase.object('users/'+key).valueChanges()
            .subscribe((user:any)=> {
              this.members.push({'image': user.image, 'name': user.name });
            });
          });
        }
        
      }
    });
  }
  startGame() {
    this.afDatabase.object(this.gameKey + '/isGameStarted').set(true);
    this.navCtrl.push(HomePage, {
      data: true,
      hostEmail: this.hostEmailAddress,
      gameKey: this.gameKey
    });
    this.members$.unsubscribe();
  }

  private showHomePage() {
    this.afDatabase.object(this.gameKey + '/isGameStarted').valueChanges()
    .subscribe((_isGameStarted: boolean) => {
        if(_isGameStarted) {
          this.navCtrl.push(HomePage, {
            data: false,
            hostEmail: this.hostEmailAddress,
            gameKey: this.gameKey
          });
        }
    });
    
  }

  private setIsLate() {
    if (!this.mode) {
      var isLate$ = this.afDatabase.object(this.gameKey + '/members/' + this.auth.user.uid  + '/isLate')
        .valueChanges();
      isLate$.subscribe((_isLateLocal: boolean) => {
        if (_isLateLocal === null || _isLateLocal === undefined) {
          if(this.currentQuestionId > 1) {
            this.afDatabase.object(this.gameKey + '/members/' + this.auth.user.uid  + '/isLate').set(true);
            this.presentAlert('Sorry you are late! You may continue watching the game.');
          } else {
            this.afDatabase.object(this.gameKey + '/members/' + this.auth.user.uid  + '/isLate').set(false);
          } 
        }
      });
    }  
  }

  private presentAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
