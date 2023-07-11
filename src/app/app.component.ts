import { Component } from '@angular/core';
import { DataService } from './core/services/data.service';
import { Person } from './shared/model/person.type';
import { Observable, Subject, delay, finalize, forkJoin, tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

enum ScoreMessage {
  Tie = 0,
  Player1 = 1,
  Player2 = 2,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      transition('*=>*', [
        style({ opacity: 0 }),
        animate(600)
      ])
    ])
  ]

})
export class AppComponent {
  constructor(private data: DataService) { }

  person1?: Person;
  person2?: Person;

  player1Score = 0;
  player2Score = 0;

  playEnabled = true;

  NaN = NaN;

  scoreMessage = new Subject<ScoreMessage>();
  ScoreMessage = ScoreMessage;

  ngOnInit() {
    // setInterval(() => {
    // }, 5000);
    this.scoreMessage.subscribe(msg => {
      if (msg === ScoreMessage.Player1) {
        this.player1Score++;
      }

      if (msg === ScoreMessage.Player2) {
        this.player2Score++;
      }
    });
  }

  reset(): void {
    this.person1 = undefined;
    this.person2 = undefined;

    this.player1Score = 0;
    this.player2Score = 0;
  }

  play() {
    this.playEnabled = false;

    forkJoin([
      this.data.getRandomPerson(),
      this.data.getRandomPerson()
    ])
      .pipe(
        tap(([person1, person2]) => {
          this.person1 = person1;
          this.person2 = person2;
        }),
        delay(500),
        tap(([person1, person2]) => {
          const mass1 = person1.mass;
          const mass2 = person2.mass;

          if (Number.isNaN(mass1) || Number.isNaN(mass2)) {
            this.scoreMessage.next(ScoreMessage.Tie);
            return;
          }

          if (mass1 === mass2) {
            this.scoreMessage.next(ScoreMessage.Tie);
            return;
          }

          this.scoreMessage.next(mass1 > mass2 ? ScoreMessage.Player1 : ScoreMessage.Player2);
        }),
        finalize(() => this.playEnabled = true)
      ).subscribe();
  }
}
