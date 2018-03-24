import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-game-ended',
  templateUrl: 'gameEnded.html'
})
export class GameEndedPage {
  private hostEmailAddress: string;
  private gameKey: string;
  private isGameEnded: boolean;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private afDatabase: AngularFireDatabase) {
      this.setupGameKey();
  }

  private setupGameKey() {
    this.hostEmailAddress = this.navParams.get('hostEmail');
    this.gameKey = this.hostEmailAddress.replace('@','at');
    this.gameKey = this.gameKey.replace('.','dot');
    this.gameKey = this.gameKey +'Game';
  }

  private getGameEnded() {
    this.afDatabase.object(this.gameKey+'/isGameEnded').valueChanges()
    .subscribe((isGend: boolean) => {
      this.isGameEnded = isGend;
      if(this.isGameEnded) {
        this.navCtrl.push(HomePage, {
          data: false,
          hostEmail: this.hostEmailAddress
        });
      }
    });
  }

}
