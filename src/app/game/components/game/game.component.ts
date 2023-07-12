import { Component } from '@angular/core';
import { Observable, delay, finalize, forkJoin, map, tap } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { Person } from 'src/app/shared/model/person.type';
import { animate, style, transition, trigger } from '@angular/animations';
import { ScoreMessage } from 'src/app/shared/model/score-message.enum';
import { Starship } from 'src/app/shared/model/starship.type';

type Player = {
  score: number;
  scoreMessage: ScoreMessage;
  person?: Person;
  starship?: Starship;
}

type ComparerFn<T> = (a: T, b: T) => number;

enum CardType {
  Person = "person",
  Starship = "starship",
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      transition('*=>*', [
        style({ opacity: 0 }),
        animate(600)
      ])
    ])
  ]
})
export class GameComponent {
  constructor(private data: DataService) { }

  /** Allow accessing CardType enum from template */
  CardType = CardType;
  cardType = CardType.Person;

  readonly player1: Player = {
    score: 0,
    scoreMessage: ScoreMessage.None,
  }

  readonly player2: Player = {
    score: 0,
    scoreMessage: ScoreMessage.None,
  }

  playButtonEnabled = true;
  roundSummary = "";

  /** Clear card data when card type changes. */
  cardTypeChanged(): void {
    this.clearPlayerCardBetweenRounds(this.player1);
    this.clearPlayerCardBetweenRounds(this.player2);
  }

  /** Main game "loop". */
  play(): void {
    this.playButtonEnabled = false;
    this.roundSummary = "";

    this.clearPlayerCardBetweenRounds(this.player1);
    this.clearPlayerCardBetweenRounds(this.player2);

    let obs: Observable<[ScoreMessage, ScoreMessage]>;

    switch (this.cardType) {
      case CardType.Person:
        obs = this.getRandomPeople();
        break;
      case CardType.Starship:
        obs = this.getRandomStarships();
        break;
    }

    obs.pipe(
        tap(scoreMessages => {
          this.processScoreMessage(scoreMessages[0], this.player1);
          this.processScoreMessage(scoreMessages[1], this.player2);
          this.updateRoundSummary();
        }),
        finalize(() => { this.playButtonEnabled = true })
    ).subscribe();
  }

  private clearPlayerCardBetweenRounds(player: Player): void {
    player.scoreMessage = ScoreMessage.None;
    player.starship = undefined;
    player.person = undefined;
  }

  private getRandomPeople(): Observable<[ScoreMessage, ScoreMessage]> {
    return forkJoin([
      this.data.getRandomPerson(),
      this.data.getRandomPerson(),
    ]).pipe(
      delay(500),
      tap(([person1, person2]) => {
        this.player1.person = person1;
        this.player2.person = person2;
      }),
      map(([person1, person2]) => this.getScoreMessage(
          person1,
          person2,
          (a, b) => (a.mass || 0) - (b.mass || 0)
        )
      ),
    );
  }

  private getRandomStarships(): Observable<[ScoreMessage, ScoreMessage]> {
    return forkJoin([
      this.data.getRandomStarship(),
      this.data.getRandomStarship(),
    ]).pipe(
      delay(500),
      tap(([starship1, starship2]) => {
        this.player1.starship = starship1;
        this.player2.starship = starship2;
      }),
      map(([starship1, starship2]) => this.getScoreMessage(
          starship1,
          starship2,
          (a, b) => (a.crew || 0) - (b.crew || 0)
        )
      ),
    );
  }

  /** Returns a tuple with `ScoreMessage` for each player,
    * based on provided `comparer` function result.
  */
  private getScoreMessage<T>(
    a: T,
    b: T,
    comparer: ComparerFn<T>
  ): [ScoreMessage, ScoreMessage] {
    let comparisonResult = comparer(a, b);
    console.log(a, b, comparisonResult);

    if (comparisonResult === 0) {
      return [ScoreMessage.Tie, ScoreMessage.Tie];
    }

    if (comparisonResult < 0) {
      return [ScoreMessage.Lose, ScoreMessage.Win];
    }

    if (comparisonResult > 0) {
      return [ScoreMessage.Win, ScoreMessage.Lose];
    }

    return [ScoreMessage.None, ScoreMessage.None];
  }

  /** Updates the score based on provided `ScoreMessage`. */
  private processScoreMessage(scoreMessage: ScoreMessage, player: Player): void {
    if (scoreMessage === ScoreMessage.Win) {
      player.score++;
    }

    player.scoreMessage = scoreMessage;
  }

  private updateRoundSummary() {
    const scoreMessage = this.player1.scoreMessage;

    switch (scoreMessage) {
      case ScoreMessage.Tie:
        this.roundSummary = "Tie!";
        break;
      case ScoreMessage.Win:
        this.roundSummary = "Player 1 Wins!";
        break;
      case ScoreMessage.Lose:
        this.roundSummary = "Player 2 Wins!";
        break;
    }
  }
}
