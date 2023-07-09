/** Represents a SWAPI resource that lives inside
  * a `SwapiCollection`. Useful for fetching
  * a full object from the api using `uid` property.
  */
export type SwapiResource = {
  uid: string;
  name: string;
  url: string;
}
