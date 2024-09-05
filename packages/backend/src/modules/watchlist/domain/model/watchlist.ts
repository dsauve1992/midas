import { v4 as uuidv4 } from 'uuid';

import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { NonEmptyString } from '../../../../lib/domain/NonEmptyString';

export class Watchlist implements Iterable<string> {
  deleted = false;

  constructor(
    readonly id: string,
    private _name: NonEmptyString,
    readonly userId: string,
    public order: number,
    private items: SymbolWithExchange[],
  ) {}

  static init(userId: string, name: NonEmptyString, order: number): Watchlist {
    return new Watchlist(uuidv4(), name, userId, order, []);
  }

  public [Symbol.iterator](): Iterator<string> {
    return this.items.map((symbol) => symbol.toString())[Symbol.iterator]();
  }

  get name(): NonEmptyString {
    return this._name;
  }

  rename(name: NonEmptyString) {
    this._name = name;
  }

  addSymbol(symbol: SymbolWithExchange) {
    if (!this.isExistsInWatchlist(symbol)) {
      this.items.push(symbol);
    }
  }

  private isExistsInWatchlist(symbol: SymbolWithExchange) {
    return !!this.items.find(
      (_symbol) => _symbol.toString() === symbol.toString(),
    );
  }

  removeSymbol(symbol: SymbolWithExchange) {
    if (this.isExistsInWatchlist(symbol)) {
      this.items = this.items.filter(
        (_symbol) => _symbol.toString() !== symbol.toString(),
      );
    }
  }

  isEmpty() {
    return this.items.length == 0;
  }

  flagAsDeleted() {
    this.items = [];
    this.order = -1;
    this.deleted = true;
  }
}
