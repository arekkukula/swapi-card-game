import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { API_ROUTES } from '../../config/api-routes';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';
import { SwapiEntity } from '../../model/swapi-entity.type';

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

    service.getPeople().subscribe({
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
  });

  it('should be able to retrieve starships collection from SWAPI', () => {
    const data: any = [];

    service.getStarships().subscribe({
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
  });

  it('should be able to retrieve a single person from SWAPI', () => {
    const data: SwapiEntity<Person> = {
      message: "ok",
      _id: "0",
      result: {
        properties: {
          mass: 100,
          name: "test",
          uid: "0"
        }
      }
    };

    service.getPerson("0").subscribe({
      next: starship => {
        expect(starship).toEqual(data);
      },
      error: err => {
        fail(`getPerson threw an error. Error: ${err}`);
      }
    });

    const req = controller.expectOne(`${API_ROUTES.people}/0`);
    expect(req.request.method).toEqual("GET");

    req.flush(data);
  });

  it('should be able to retrieve a single starship from SWAPI', () => {
    const data: SwapiEntity<Starship> = {
      message: "ok",
      _id: "0",
      result: {
        properties: {
          crew: 1,
          name: "test",
          uid: "1"
        }
      }
    };

    service.getStarship("1").subscribe({
      next: starship => {
        expect(starship).toEqual(data);
      },
      error: err => {
        fail(`getStarship threw an error. Error: ${err}`);
      }
    });

    const req = controller.expectOne(`${API_ROUTES.starships}/1`);
    expect(req.request.method).toEqual("GET");

    req.flush(data);
  });
});

