import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Person } from 'src/app/shared/model/person.type';
import { cardDetailsAnimations } from '../card-details.animations';

@Component({
  selector: 'app-person-card-details',
  templateUrl: './person-card-details.component.html',
  styleUrls: ['./person-card-details.component.scss'],
  animations: cardDetailsAnimations
})
export class PersonCardDetailsComponent {
  @Input() person?: Person;
  @Input() drawing = false;

  encouragementText =
    "press Play to draw a card with a Star Wars character!";
  drawingCardText =
    "Drawing a card...";
}
