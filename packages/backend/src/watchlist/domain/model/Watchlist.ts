export class Watchlist implements Iterable<string> {
  constructor() {}

  [Symbol.iterator](): Iterator<string> {
    return undefined;
  }
}
