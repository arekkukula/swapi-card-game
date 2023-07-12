import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, tap} from 'rxjs';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';
import { API_ROUTES } from '../config/api-routes';
import { SwapiEntity } from '../model/swapi-entity.type';
import { SwapiCollection } from '../model/swapi-collection.type';
import { SwapiResource } from '../model/swapi-resource.type';
import { SwapiPerson } from '../model/swapi-person.type';
import { Mapper } from '../util/mapper';
import { SwapiStarship } from '../model/swapi-starship.type';

/**
  * A low-level service providing communication with SWAPI. */
@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }


  // Necessary evil as SWAPI's rate limiting is very steep.
  // It only affects the initial "get all" requests.
  private static readonly PEOPLE_METADATA_LS_KEY = "peopleMetadata" as const;
  private static readonly STARSHIPS_METADATA_LS_KEY = "starshipsMetadata" as const;

  getPeopleMetadata(): Observable<SwapiResource[]> {
    const ls = localStorage.getItem(ApiService.PEOPLE_METADATA_LS_KEY);
    if (ls) {
      return of(JSON.parse(ls));
    }

    return this.getAllItems(API_ROUTES.people)
      .pipe(tap(items => {
        localStorage.setItem(
          ApiService.PEOPLE_METADATA_LS_KEY,
          JSON.stringify(items))
      }));
  }

  getStarshipsMetadata(): Observable<SwapiResource[]> {
    const ls = localStorage.getItem(ApiService.STARSHIPS_METADATA_LS_KEY);
    if (ls) {
      return of(JSON.parse(ls));
    }

    return this.getAllItems(API_ROUTES.starships)
      .pipe(tap(items => {
        localStorage.setItem(
          ApiService.STARSHIPS_METADATA_LS_KEY,
          JSON.stringify(items))
      }));
  }

  getPerson(uid: string): Observable<Person> {
    return this.http.get<SwapiEntity<SwapiPerson>>(`${API_ROUTES.people}/${uid}`).pipe(
      map(res => {
        if (res.message === "not found") {
          throw new Error(`Person with uid ${uid} not found`);
        }

        // copy the description into the actual response object
        res.result.properties.description = res.result.description;
        return Mapper.mapPerson(res.result!.properties)
      })
    );
  }

  getStarship(uid: string): Observable<Starship> {
    return this.http.get<SwapiEntity<SwapiStarship>>(`${API_ROUTES.starships}/${uid}`).pipe(
      map(res => {
        if (res.message === "not found") {
          throw new Error(`Starship with uid ${uid} not found`);
        }

        // copy the description into the actual response object
        res.result.properties.description = res.result.description!;
        return Mapper.mapStarship(res.result.properties)
      })
    );
  }

  /** Retrieves all resources from a given route. */
  private getAllItems(route: string): Observable<SwapiResource[]> {
    return this.http.get<SwapiCollection>(route)
      .pipe(
        switchMap(response => {
          const params = new HttpParams()
            .set("page", 1)
            .set("limit", response.total_records);

          return this.http.get<SwapiCollection>(
            route, { params }
          ).pipe(map(response => response.results));
        })
      );
  }
}

