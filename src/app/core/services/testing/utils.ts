
import { Person } from 'src/app/shared/model/person.type';
import { of } from 'rxjs';
import { Starship } from 'src/app/shared/model/starship.type';
import { SwapiResource } from '../../model/swapi-resource.type';
import { SwapiEntity } from '../../model/swapi-entity.type';
import { ApiService } from '../api.service';
import { SwapiPerson } from '../../model/swapi-person.type';
import { SwapiStarship } from '../../model/swapi-starship.type';

// ---
// Core services testing utilities
// ---

export function prng() {
  let counter = 0;

  return {
    move: function(by: number) {
      counter = (counter + by) % 1;
      return counter;
    },
    peek: () => counter
  }
}

export function toSwapiResource<T extends { uid: string, name: string }>(
  data: T[],
  endpoint: string,
): SwapiResource[] {
  return data.map(x => {
    return <SwapiResource>{
      uid: x.uid,
      name: x.name,
      url: `${endpoint}/${x.uid}`
    }
  });
}

export function toSwapiEntity<T extends { uid: string }>(data: T | undefined): SwapiEntity<T> {
  if (!data) {
    return {
      message: "not found"
    }
  }

  return {
    message: "ok",
    _id: data.uid,
    result: {
      properties: data
    }
  }
}

export function toSwapiPerson(person: Person): SwapiPerson {
  return {
    ...person,
    mass: person.mass.toString()
  }
}

export function toSwapiStarship(starship: Starship): SwapiStarship {
  return {
    ...starship,
    crew: starship.crew.toString()
  }
}

export const mockData = {
  people: <Person[]>[
    { uid: '1', name: "test 1", mass: 0 },
    { uid: '2', name: "test 2", mass: 25 },
    { uid: '3', name: "test 3", mass: 50 },
    { uid: '4', name: "test 4", mass: 75 }
  ],
  starships: <Starship[]>[
    { uid: '1', name: "test 1", crew: 0, description: "", },
    { uid: '2', name: "test 2", crew: 25, description: "" },
    { uid: '3', name: "test 3", crew: 50, description: "" },
    { uid: '4', name: "test 4", crew: 75, description: "" }
  ],
}

export function mockApiService() {
  const peopleResource = toSwapiResource(mockData.people, "people");
  const starshipsResource = toSwapiResource(mockData.starships, "starships");

  const getPerson = (uid: string) => mockData.people.find(p => p.uid === uid)!;
  const getStarship = (uid: string) => mockData.starships.find(s => s.uid === uid)!;

  const api: jasmine.SpyObj<ApiService> = jasmine.createSpyObj(
    'ApiService',
    <(keyof ApiService)[]>[
      'getPeopleMetadata',
      'getStarshipsMetadata',
      'getPerson',
      'getStarship'
    ]);

  api.getPeopleMetadata.and.returnValue(of(peopleResource));
  api.getStarshipsMetadata.and.returnValue(of(starshipsResource));
  api.getPerson.and.callFake(uid => of(getPerson(uid)));
  api.getStarship.and.callFake(uid => of(getStarship(uid)));

  return api;
}

