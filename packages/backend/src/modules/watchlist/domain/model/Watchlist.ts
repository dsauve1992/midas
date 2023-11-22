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
    let pointer = 0;
    const items = this.items;

    return {
      next(): IteratorResult<string> {
        if (pointer < Array.from(items).length) {
          return {
            done: false,
            value: items[pointer++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
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
