import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ScoreMessage } from 'src/app/game/model/score-message.enum';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  animations: [
    trigger('animateButton', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0) translateY(50px)'
        }),
        animate("200ms 200ms ease-in"),
        animate("100ms", style({
          transform: 'scale(1) translateY(-10px)',
          opacity: 1,
        })),
        animate("100ms 300ms ease-out", style({
          transform: 'scale(1) translateY(0)',
          opacity: 1,
        }))
      ]),
      transition(':leave', [
        animate("300ms 200ms ease-in-out", style({
          opacity: 0,
          transform: 'scale(0) translateY(50px)',
        })),
      ])
    ])
  ]
})
export class GameCardComponent {
  ScoreMessage = ScoreMessage;

  @Input() title = "";
  @Input() scoreMessage: ScoreMessage = ScoreMessage.None;

}
