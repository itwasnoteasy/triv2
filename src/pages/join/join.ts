import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
    private afDatabase: AngularFireDatabase,
    private auth: AuthProvider) {
    console.log(auth.user);
    this.hostEmailAddress = 'itwasnoteasy@gmail.com';
    var gameKey = this.hostEmailAddress.replace('@', 'at');
    gameKey = gameKey.replace('.', 'dot');
    gameKey = gameKey +'Game';
    this.gameKey = gameKey;
     // Game has begun so clear out all the values and set question = 0
     this.afDatabase.object(this.gameKey + '/currentQuestionId').set(0);
     this.afDatabase.object(this.gameKey).set('');
     this.afDatabase.object(this.gameKey + '/isGameEnded').set(false);
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
              for(var i=0; i<10; i++) {
                this.members.push({'image': user.image, 'name': user.name });
              }
            });
          });
        }
        
      }
    });
  }
  startGame() {
    this.navCtrl.push(HomePage, {
      data: true,
      hostEmail: this.hostEmailAddress
    });
    this.members$.unsubscribe();
  }
}
