import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from 'src/app/shared/model/person.type';
import { Starship } from 'src/app/shared/model/starship.type';

@Injectable()
export class ApiService {
  constructor() { }

  getAllPeople(): Observable<Person[]> {
    throw "";
  }

  getAllStarships(): Observable<Starship[]> {
    throw "";
  }
}
