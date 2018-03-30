import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameEndedPage } from '../gameEnded/gameEnded';
import { Observable } from 'rxjs/Observable';
import { JoinPage } from '../join/join';
import { AuthProvider } from '../../providers/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private isHosting: boolean;
  private hostEmailAddress: string;
  private isGameEnded$: any;
  private isGameEnded: boolean;
  private hostLabelColor: string = 'primary';

  constructor(public navCtrl: NavController,
    private afDatabase: AngularFireDatabase,
    private auth: AuthProvider) {
     this.isHosting = true;
  }

  join() {
    this.isHosting = false;
  }

  private checkGameEnded(mode) {
    if (this.hostEmailAddress != null && this.hostEmailAddress !== undefined) {
      var gameKey = this.hostEmailAddress.replace('@', 'at');
      gameKey = gameKey.replace('.', 'dot');
      gameKey = gameKey +'Game'
      this.isGameEnded$ = this.afDatabase.object(gameKey + '/isGameEnded').valueChanges()
      .subscribe((isGameEnded: boolean) => {
          this.isGameEnded = isGameEnded;
          this.showGamePage(mode);
        });
    } else {
      this.blinkHostLabel();
    }
  }

  private blinkHostLabel() {
    this.hostLabelColor = 'danger'; 
    var blink = setInterval(() => {
      if(this.hostLabelColor == 'primary') {
      this.hostLabelColor = 'danger';  
      } else {
        this.hostLabelColor = 'primary';  
      }
    }, 175);

    setTimeout(() => {
      clearInterval(blink);
    }, 1100);
    
  }

  hostMode(mode) {
    if(!mode) {
      this.checkGameEnded(mode);
    } else {
      this.navCtrl.push(JoinPage, {data:mode, hostEmail: this.auth.user.email});
    } 
  }

  showGamePage(mode) {
    if (!this.isGameEnded) {
      this.navCtrl.push(JoinPage, {
        data: mode,
        hostEmail: this.hostEmailAddress
      });
    } else {
      this.navCtrl.push(GameEndedPage, {
        data: mode,
        hostEmail: this.hostEmailAddress
      });
    }
    this.isGameEnded$.unsubscribe();
  }
}
