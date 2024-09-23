import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export class SnapshotDifference {
  constructor(
    readonly newSymbols: SymbolWithExchange[],
    readonly removedSymbols: SymbolWithExchange[],
    readonly sameSymbols: SymbolWithExchange[],
  ) {}
}

export class ScreenerSnapshot {
  readonly symbols: SymbolWithExchange[];

  constructor(symbols: SymbolWithExchange[]) {
    this.symbols = symbols;
  }

  differenceFrom(other: ScreenerSnapshot) {
    return new SnapshotDifference(
      this.symbols.filter((symbol) => !other.symbols.includes(symbol)),
      other.symbols.filter((symbol) => !this.symbols.includes(symbol)),
      this.symbols.filter((symbol) => other.symbols.includes(symbol)),
    );
  }

  public [Symbol.iterator](): Iterator<SymbolWithExchange> {
    return this.symbols[Symbol.iterator]();
  }
}
