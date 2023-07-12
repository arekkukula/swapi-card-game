import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './components/game/game.component';
import { SharedModule } from '../shared/shared.module';
import { GameCardComponent } from './components/game-card/game-card.component';
import { PersonCardDetailsComponent } from './components/person-card-details/person-card-details.component';
import { StarshipCardDetailsComponent } from './components/starship-card-details/starship-card-details.component';

@NgModule({
  declarations: [
    GameComponent,
    GameCardComponent,
    PersonCardDetailsComponent,
    StarshipCardDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    GameComponent
  ]
})
export class GameModule { }
