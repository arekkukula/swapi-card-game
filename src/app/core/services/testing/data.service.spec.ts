import { TestBed } from '@angular/core/testing';
import { DATASERVICE_RANDOM_GEN, DataService } from '../data.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import * as utils from "./utils";

describe('DataService', () => {
  let service: DataService;
  let api: ApiService;
  let controller: HttpTestingController;
  let prng: ReturnType<typeof utils.prng>;

  beforeEach(() => {
    api = utils.mockApiService();
    prng = utils.prng();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
        { provide: ApiService, useValue: api },
        { provide: DATASERVICE_RANDOM_GEN, useValue: () => prng.peek() }
      ]
    });

    service = TestBed.inject(DataService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('gets people and starships data upon creation', () => {
    expect(api.getPeople).toHaveBeenCalled();
    expect(api.getStarships).toHaveBeenCalled();
  });

  it('returns a random person', () => {
    console.log(prng);
    service.getRandomPerson().subscribe(person => {
      expect(person).toEqual(utils.mockData.people[0]);
    });

    prng.move(1 / utils.mockData.people.length);

    service.getRandomPerson().subscribe(person => {
      expect(person).toEqual(utils.mockData.people[1]);
    });

    prng.move(1 / utils.mockData.people.length);

    service.getRandomPerson().subscribe(person => {
      expect(person).toEqual(utils.mockData.people[2]);
    });

    prng.move(1 / utils.mockData.people.length);

    service.getRandomPerson().subscribe(person => {
      expect(person).toEqual(utils.mockData.people[3]);
    });
  });

  it('returns a random starship', () => {
    console.log(prng);
    service.getRandomStarship().subscribe(person => {
      expect(person).toEqual(utils.mockData.starships[0]);
    });

    prng.move(1 / utils.mockData.starships.length);

    service.getRandomStarship().subscribe(person => {
      expect(person).toEqual(utils.mockData.starships[1]);
    });

    prng.move(1 / utils.mockData.starships.length);

    service.getRandomStarship().subscribe(person => {
      expect(person).toEqual(utils.mockData.starships[2]);
    });

    prng.move(1 / utils.mockData.people.length);

    service.getRandomStarship().subscribe(person => {
      expect(person).toEqual(utils.mockData.starships[3]);
    });
  });
});
