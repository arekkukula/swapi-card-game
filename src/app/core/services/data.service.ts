import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, map, forkJoin, of, tap, filter, catchError, finalize } from 'rxjs';
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
  ) {}

  /** Function retrieving all metadata for people and starships.
    * To be used in `APP_INITIALIZER` as it's a requirement for
    * the app to have this data.
    */
  initializeData(): Promise<void> {
    return new Promise<void>(resolve => {
      forkJoin([
        this.api.getPeopleMetadata(),
        this.api.getStarshipsMetadata()
      ]).pipe(
        finalize(() => resolve())
      ).subscribe({
          next: ([people, starships]) => {
            this.metadata.people = people;
            this.metadata.starships = starships;
          },
          error: () => {
            throw new Error("Unrecoverable error: Cannot get data from the API");
          },
        });
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
  private readonly metadata: Record<DataKeys, SwapiResource[]> = {
    people: [],
    starships: [],
  };

  getRandomPerson(): Observable<Person> {
    const len = this.metadata.people.length;
    const rand = Math.floor(this.prng() * len);

    const dataItem = this.metadata.people[rand];
    const person = this.cache.people.get(dataItem.uid);

    if (!person) {
      return this.api.getPerson(dataItem.uid).pipe(
        tap(person => {
          this.cache.people.set(dataItem.uid, person);
        }),
      );
    }

    return of(person);
  }

  getRandomStarship(): Observable<Starship> {
    const len = this.metadata.starships.length;
    const rand = Math.floor(this.prng() * len);

    const dataItem = this.metadata.starships[rand];
    const starship = this.cache.starships.get(dataItem.uid);

    if (!starship) {
      return this.api.getStarship(dataItem.uid).pipe(
        tap(starship => {
          this.cache.starships.set(dataItem.uid, starship);
        }),
      );
    }

    return of(starship);
  }
}
