import { v4 as uuidv4 } from 'uuid';

import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export class Watchlist implements Iterable<string> {
  deleted = false;

  constructor(
    readonly id: string,
    readonly name: string,
    readonly userId: string,
    public order: number,
    private items: Set<SymbolWithExchange>,
  ) {}

  static init(userId: string, name: string, order: number): Watchlist {
    return new Watchlist(
      uuidv4(),
      name,
      userId,
      order,
      new Set<SymbolWithExchange>(),
    );
  }

  public [Symbol.iterator](): Iterator<string> {
    return Array.from(this.items)
      .map((symbol) => symbol.toString())
      [Symbol.iterator]();
  }

  addSymbol(symbol: SymbolWithExchange) {
    this.items.add(symbol);
  }

  removeSymbol(symbol: SymbolWithExchange) {
    this.items.delete(symbol);
  }

  isEmpty() {
    return this.items.size == 0;
  }

  flagAsDeleted() {
    this.items.clear();
    this.order = -1;
    this.deleted = true;
  }
}
