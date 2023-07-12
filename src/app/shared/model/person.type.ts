/** Represents a person retrieved from SWAPI.
  * All we need to know for now is that a person
  * has a mass.
*/
export type Person = {
  mass: number;
  name: string;
  uid: string;
  description: string;
  birth_year: string;
  hair_color: string;
  gender: string;
  height: string;
}
