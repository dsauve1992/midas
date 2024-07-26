import { v4 as uuidv4 } from 'uuid';

export class Watchlist implements Iterable<string> {
  deleted = false;

  constructor(
    readonly id: string,
    readonly name: string,
    readonly userId: string,
    private items: Set<string>,
  ) {}

  static init(userId: string, name: string): Watchlist {
    return new Watchlist(uuidv4(), name, userId, new Set<string>());
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
    return this.items.size == 0;
  }

  flagAsDeleted() {
    this.items.clear();
    this.deleted = true;
  }
}
