import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { API_ROUTES } from '../../config/api-routes';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';
import { SwapiEntity } from '../../model/swapi-entity.type';
import { SwapiPerson } from '../../model/swapi-person.type';
import { catchError, of } from 'rxjs';
import * as utils from "./utils";

describe('ApiService', () => {
  let service: ApiService;
  let controller: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    controller = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to retrieve people collection from SWAPI', () => {
    const data: any = [];

    service.getPeopleMetadata().subscribe({
      next: people => {
        expect(people).toEqual(data);
      },
      error: err => {
        fail(`getPeople threw an error. Error: ${err}`);
      }
    });

    const req = controller.expectOne({
      url: API_ROUTES.people,
      method: "GET"
    });

    req.flush(data);
    expect().nothing();
  });

  it('should be able to retrieve starships collection from SWAPI', () => {
    const data: any = [];

    service.getStarshipsMetadata().subscribe({
      next: people => {
        expect(people).toEqual(data);
      },
      error: err => {
        fail(`getStarships threw an error. Error: ${err}`);
      }
    });

    const req = controller.expectOne(API_ROUTES.starships);
    expect(req.request.method).toEqual("GET");

    req.flush(data);
    expect().nothing();
  });

  it('should be able to retrieve a single person from SWAPI', () => {
    service.getPerson("0").pipe(catchError(_ => of(null))).subscribe();

    const req = controller.expectOne(`${API_ROUTES.people}/0`);
    expect(req.request.method).toEqual("GET");

    req.flush(null);
  });

  it('should be able to retrieve a single starship from SWAPI', () => {
    service.getStarship("1").pipe(catchError(_ => of(null))).subscribe();

    const req = controller.expectOne(`${API_ROUTES.starships}/1`);
    expect(req.request.method).toEqual("GET");

    req.flush(null);
  });

  it('maps raw SWAPI person response to app model person', () => {
    const person = utils.mockData.people[0];
    const swapiPerson = utils.toSwapiPerson(person);
    const swapiEntity = utils.toSwapiEntity(swapiPerson);

    service.getPerson("0").subscribe({
      next: p => {
        expect(p).toEqual(person);
      },
      error: _ => {
        fail("Service did not map Person correctly.");
      }
    });

    const req = controller.expectOne(`${API_ROUTES.people}/0`);
    expect(req.request.method).toEqual("GET");
    req.flush(swapiEntity);
  });

  it('maps raw SWAPI starship response to app model starship', () => {
    const starship = utils.mockData.starships[0];
    const swapiStarship = utils.toSwapiStarship(starship);
    const swapiEntity = utils.toSwapiEntity(swapiStarship);

    service.getStarship("0").subscribe({
      next: s => {
        expect(s).toEqual(starship);
      },
      error: _ => {
        fail("Service did not map Starship correctly.");
      }
    });

    const req = controller.expectOne(`${API_ROUTES.starships}/0`);
    expect(req.request.method).toEqual("GET");
    req.flush(swapiEntity);
  });
});

