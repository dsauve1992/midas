export class SymbolWithExchange {
  constructor(
    readonly exchange: string,
    readonly symbol: string,
  ) {}

  static from(symbol: string) {
    const [exchange, symbolName] = symbol.split(':');

    if (!exchange.length || !symbolName.length) {
      throw new Error('ticker symbol must be formatted as EXCHANGE:SYMBOL');
    }

    return new SymbolWithExchange(exchange, symbolName);
  }

  equals(other: SymbolWithExchange) {
    return this.exchange === other.exchange && this.symbol === other.symbol;
  }

  toString() {
    return `${this.exchange}:${this.symbol}`;
  }
}
