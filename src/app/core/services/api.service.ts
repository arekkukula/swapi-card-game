import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';
import { API_ROUTES } from '../config/api-routes';
import { SwapiEntity } from '../model/swapi-entity.type';
import { SwapiCollection } from '../model/swapi-collection.type';
import { SwapiResource } from '../model/swapi-resource.type';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {
  }

  getPeople(): Observable<SwapiResource[]> {
    return this.getAllItems(API_ROUTES.people);
  }

  getStarships(): Observable<SwapiResource[]> {
    return this.getAllItems(API_ROUTES.starships);
  }

  getPerson(uid: string): Observable<SwapiEntity<Person>> {
    return this.http.get<SwapiEntity<Person>>(`${API_ROUTES.people}/${uid}`).pipe(
      map(res => {
        if (res.message === "not found") {
          throw new Error(`Person with uid ${uid} not found`);
        }

        return res;
      })
    );
  }

  getStarship(uid: string): Observable<SwapiEntity<Starship>> {
    return this.http.get<SwapiEntity<Starship>>(`${API_ROUTES.starships}/${uid}`).pipe(
      map(res => {
        if (res.message === "not found") {
          throw new Error(`Starship with uid ${uid} not found`);
        }

        return res;
      })
    );
  }

  /** Retrieves all resources from a given route. */
  private getAllItems(route: string) {
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

