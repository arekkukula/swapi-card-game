import { SwapiResource } from "./swapi-resource.type";

/** Represents a SWAPI response for a call to endpoint
  * with no parameters retrieving all resources, e.g. from
  * `/api/starships`.
*/
export type SwapiCollection = {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: SwapiResource[];
}
