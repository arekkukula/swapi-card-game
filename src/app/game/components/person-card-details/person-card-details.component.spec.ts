import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCardDetailsComponent } from './person-card-details.component';

describe('PersonCardDetailsComponent', () => {
  let component: PersonCardDetailsComponent;
  let fixture: ComponentFixture<PersonCardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonCardDetailsComponent]
    });
    fixture = TestBed.createComponent(PersonCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
