import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, map, forkJoin, of, tap, filter, catchError } from 'rxjs';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';
import { ApiService } from './api.service';
import { SwapiResource } from '../model/swapi-resource.type';

type DataKeys = "people" | "starships";

export const DATASERVICE_RANDOM_GEN = new InjectionToken<() => number>("Data Service PRNG in range [0, 1)");


/** Bridge service between the API and the application. */
@Injectable()
export class DataService {
  constructor(
    private api: ApiService,
    @Inject(DATASERVICE_RANDOM_GEN)
    private prng: () => number,
  ) {
    forkJoin([
      this.api.getPeople(),
      this.api.getStarships()
    ]).subscribe({
      next: ([people, starships]) => {
        this.dataItems.people = people;
        this.dataItems.starships = starships;
      },
      error: () => {
        throw new Error("Unrecoverable error: Cannot get data from the API");
      },
    });
  }

  /** Every fetched resource is stored here to avoid
    * calling the API multiple times with the same request.
    */
  private readonly cache = {
    people: new Map<string, Person>(),
    starships: new Map<string, Starship>()
  } satisfies Record<DataKeys, Map<string, unknown>>;

  /** Stores collections with all SWAPI resources per route,
    * populated at construction time.
    */
  private readonly dataItems: Record<DataKeys, SwapiResource[]> = {
    people: [],
    starships: [],
  };

  getRandomPerson(): Observable<Person> {
    const len = this.dataItems.people.length;
    const rand = Math.floor(this.prng() * len);

    const dataItem = this.dataItems.people[rand];
    const person = this.cache.people.get(dataItem.uid);

    if (!person) {
      return this.api.getPerson(dataItem.uid).pipe(
        // assume we cannot get undefined programatically
        map(person => person.result!.properties),
        tap(person => {
          this.cache.people.set(dataItem.uid, person);
        }),
      );
    }

    return of(person);
  }

  getRandomStarship(): Observable<Starship> {
    const len = this.dataItems.starships.length;
    const rand = Math.floor(this.prng() * len);

    const dataItem = this.dataItems.starships[rand];
    const starship = this.cache.starships.get(dataItem.uid);

    if (!starship) {
      return this.api.getStarship(dataItem.uid).pipe(
        // assume we cannot get undefined programatically
        map(response => response.result!.properties),
        tap(starship => {
          this.cache.starships.set(dataItem.uid, starship);
        }),
      );
    }

    return of(starship);
  }
}
