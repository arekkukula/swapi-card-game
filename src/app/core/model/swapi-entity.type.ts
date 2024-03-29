/** Represents a response from SWAPI containing
  * the whole object thats being fetched, e.g.
  * by requesting `/api/starships/1`.
  */
export type SwapiEntity<T> =
| { message: "not found" }
| {
  message: "ok",
  result: {
    description: string,
    properties: T,
  },
  _id: string;
}
