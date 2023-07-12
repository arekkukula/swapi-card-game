import { animate, style, transition, trigger } from "@angular/animations";

export const cardDetailsAnimations = [
  trigger('animate', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'rotateY(60deg)',
      }),
      animate(300),
    ]),

    transition(':leave', [
      animate(300, style({
        opacity: 0,
      })),
    ]),
  ])
];
