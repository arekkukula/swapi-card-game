import { SwapiPerson } from "../model/swapi-person.type";
import { Person } from "../../shared/model/person.type";
import { SwapiStarship } from "../model/swapi-starship.type";
import { Starship } from "../../shared/model/starship.type";

// As API returns all numerical properties as strings,
// and we need to compare the numbers, it's better to
// have them mapped here than to parse them everytime
// we want to compare them.

export class Mapper {
  static mapPerson(person: SwapiPerson): Person {
    return {
      ...person,
      mass: Number.parseInt(person.mass),
    }
  }

  static mapStarship(starship: SwapiStarship): Starship {
    return {
      ...starship,
      crew: Number.parseInt(starship.crew)
    }
  }
}
