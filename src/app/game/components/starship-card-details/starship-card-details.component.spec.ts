import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipCardDetailsComponent } from './starship-card-details.component';

describe('StarshipCardDetailsComponent', () => {
  let component: StarshipCardDetailsComponent;
  let fixture: ComponentFixture<StarshipCardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarshipCardDetailsComponent]
    });
    fixture = TestBed.createComponent(StarshipCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
