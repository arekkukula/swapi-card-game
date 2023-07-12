import { SwapiStarship } from "src/app/core/model/swapi-starship.type";
/** Represents a starship retrieved from SWAPI.
  * All we need to know for now is that a starship
  * has a crew.
*/
export type Starship = {
  starship_class: string;
  crew: number;
  description: string;
  hyperdrive_rating: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  uid: string;
}
