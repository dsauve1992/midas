export class Watchlist implements Iterable<string> {
  constructor(
    private _userId: string,
    private items: Set<string>,
  ) {}

  static init(userId: string): Watchlist {
    return new Watchlist(userId, new Set<string>());
  }

  get userId(): string {
    return this._userId;
  }

  public [Symbol.iterator](): Iterator<string> {
    return this.items[Symbol.iterator]();
  }

  addSymbol(symbol: string) {
    this.items.add(symbol);
  }

  removeSymbol(symbol: string) {
    this.items.delete(symbol);
  }

  isEmpty() {
    return this.items.size;
  }
}
