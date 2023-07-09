/** Represents a starship retrieved from SWAPI.
  * All we need to know for now is that a starship
  * has a crew.
*/
export type Starship = {
  crew: number;
  name: string;
  uid: string;
}

