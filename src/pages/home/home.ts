import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthPage } from '../auth/home/home'
import { AuthProvider } from '../../providers/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private userInfo:any;
  public static DELAY=10000;
  private currentQuestionId: Observable<any>;
  private currentQuestion: Observable<any>;
  private currentQuestionIdVal: number = -1;
  private currentOptions: Observable<any[]>;
  private uniqueUserEmail: string;
  private hostUserEmail: string;
  private isHost: boolean;
  private checkStatus: boolean;
  private olProps: boolean[]= [true, true, true];
  private chosenColor: string[] = ['','',''];
  private disabledProp = false;
  private gameAnswers: any;
  private totalPlayers: number;
  private optionSelectedCount: number[] = [0,0,0];
  private displaySelectionCount: boolean = false;
  private tick: number = 0;
  private answer: number;
  private chosenOption: number;
  private isLate: boolean = false;
  private isEliminated: boolean = false;
  private isQuestionEnded: boolean = false;
  private winner: string;
  constructor(public navCtrl: NavController,
    public auth: AuthProvider,
    private afDatabase: AngularFireDatabase, 
    private navParams: NavParams,
    private alertCtrl: AlertController,
  ) {
    this.userInfo = auth.user;
    console.log(auth.user);
    this.isHost = this.navParams.get('data');
    if(!this.isHost) {
      this.hostUserEmail = this.navParams.get('hostEmail');
      console.log(this.hostUserEmail);
      this.hostUserEmail = this.hostUserEmail.replace('@','at');
      this.hostUserEmail = this.hostUserEmail.replace('.','dot');
    }

    this.afDatabase.object(this.hostUserEmail + 'Game/winner')
    .valueChanges().subscribe((winner: string) => {
      this.winner = winner;
    });  

    if (this.userInfo !== null && this.userInfo !== undefined) {
      this.uniqueUserEmail = this.userInfo.email.replace('@', 'at');
      this.uniqueUserEmail = this.uniqueUserEmail.replace('.', 'dot');

      if (this.isHost) {
        this.hostUserEmail = this.uniqueUserEmail;
        // Game has begun so clear out all the values and set question = 0
        this.afDatabase.object('hostUsers/' + this.hostUserEmail + '/currentQuestionId').set(0);
        this.afDatabase.object(this.hostUserEmail + 'Game/').set('');
      }
      this.currentQuestionId = this.afDatabase.object('hostUsers/' + this.hostUserEmail + '/currentQuestionId').valueChanges();
      this.currentQuestionId.subscribe(((cv: number) => {
        if (cv != this.currentQuestionIdVal) {
          this.currentQuestionIdVal = cv;
          this.disabledProp = false;
          this.displaySelectionCount = false;
          this.isQuestionEnded = false;
          this.chosenOption = -1;
          this.olProps = [true, true, true];
          this.optionSelectedCount = [0, 0, 0];
          this.chosenColor = ['', '', ''];
          if (this.isHost) {
            this.afDatabase.object(this.hostUserEmail + 'Game/isQuestionEnded').set(false);
          }
          this.currentQuestion = this.afDatabase.object('questions/' + this.currentQuestionIdVal).valueChanges();
          this.currentOptions = this.afDatabase.list('options/' + this.currentQuestionIdVal).valueChanges();
          this.afDatabase.object('answers/' + this.currentQuestionIdVal).valueChanges()
            .subscribe((ans: number) => {
              this.answer = ans;
            });
          this.checkStatus = false;
          if (this.currentQuestionIdVal > 0) {
            if (this.currentQuestionIdVal == 1) {
              this.isEliminated = false;
              this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isEliminated').set(false);
            }
            this.tick = 0;
            var tickIncrement = setInterval(() => {
              if (this.tick < 10) {
                this.tick++;
                if (this.tick == 10) {
                  this.disabledProp = true;
                }
              } else {
                clearInterval(tickIncrement);
              }
            }, 1000);

            // set question ended flag to true after 10 seconds.
            if (this.isHost) {
              setTimeout(() => {
                this.afDatabase.object(this.hostUserEmail + 'Game/isQuestionEnded').set(true);
              }, 10000);
            }

            this.afDatabase.object(this.hostUserEmail + 'Game/isQuestionEnded')
              .valueChanges().subscribe((qEnded: boolean) => {
                this.isQuestionEnded = qEnded;
              })

            // take 1 second extra time to show the results for any latency factor.
            setTimeout(() => {
              console.log('11 seconds');
              this.countAnswers();
              this.setElimination();
            }, 11000);

            setTimeout(() => {
              console.log('12 seconds');
              this.displayResultForQuestion()
            }, 12000);
          }
        }
      }));

      this.setIsLate();

      this.afDatabase.object(this.hostUserEmail + 'Game/').snapshotChanges()
        .subscribe((gameAnswers: any) => {
          if (gameAnswers != null && gameAnswers != undefined) {
            this.gameAnswers = gameAnswers;
          }
        });
    }
  }

  public logout() {
    this.auth.logout();
    this.navCtrl.push(AuthPage);
  }

  private setElimination() {
    if (this.chosenOption >= 0) {
      if ((this.answer - 1) == this.chosenOption) {
        this.chosenColor[this.chosenOption] = 'secondary';
        if(this.optionSelectedCount[this.answer-1] == 1) {
          this.afDatabase.object(this.hostUserEmail + 'Game/winner').set(this.uniqueUserEmail);
        }
      } else {
        this.chosenColor[this.chosenOption] = 'danger';
        this.isEliminated = true;
        this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isEliminated').set(true);
      }
    } else if(!this.isEliminated){
      this.isEliminated = true;
      this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isEliminated').set(true);
    }
    this.displaySelectionCount = true;
  }

  private displayResultForQuestion() {
    if(this.winner !== null && this.winner !== undefined) {
      this.presentAlert('We have a winner:'+this.winner);
    }
  }

  private countAnswers() {
    if (this.isQuestionEnded != null && this.isQuestionEnded) {
      console.log('countingAnswers');
        var gameAnswers = this.gameAnswers.payload.val();
        this.totalPlayers = this.gameAnswers.payload.numChildren();
        Object.keys(gameAnswers).forEach(key => {
          if (key !== 'isLate' && key !== 'winner' && key !== 'isQuestionEnded') {
            this.optionSelectedCount[(gameAnswers[key][this.currentQuestionIdVal] - 1)] += 1;
          }
        });
    }
  }

  private setIsLate() {
    if (!this.isHost) {
      var isLate$ = this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isLate')
        .valueChanges();
      isLate$.subscribe((_isLateLocal: boolean) => {
        if (_isLateLocal === null || _isLateLocal === undefined) {
          if(this.currentQuestionIdVal > 1) {
            this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isLate').set(true);
            this.isLate = true;
            this.presentAlert('Sorry you are late! You may continue watching the game.');
          } else {
            this.afDatabase.object(this.hostUserEmail + 'Game/' + this.uniqueUserEmail + '/isLate').set(false);
            this.isLate = false;
          } 
        }
      });
    }  
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  chosen(i,currentQ) {
    this.olProps[i] = false;
    this.chosenOption = i;
    this.disabledProp = true;
    this.afDatabase.object(this.hostUserEmail+'Game/'+this.uniqueUserEmail+'/'+currentQ).set((i+1));
  }

  nextQuestion() {
      if(this.isHost) {
        this.afDatabase.object('hostUsers/'+this.uniqueUserEmail+'/currentQuestionId')
        .set(this.currentQuestionIdVal+1);
        this.checkStatus = true; 
      };
  }

}
