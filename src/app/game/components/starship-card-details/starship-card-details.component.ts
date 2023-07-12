import { Component, Input } from '@angular/core';
import { Starship } from 'src/app/shared/model/starship.type';
import { cardDetailsAnimations } from '../card-details.animations';

@Component({
  selector: 'app-starship-card-details',
  templateUrl: './starship-card-details.component.html',
  styleUrls: ['./starship-card-details.component.scss'],
  animations: cardDetailsAnimations
})
export class StarshipCardDetailsComponent {
  @Input() starship?: Starship;
  @Input() drawing = false;

  encouragementText =
    "press Play to draw a card with a Star Wars character!";
  drawingCardText =
    "Drawing a card...";
}
