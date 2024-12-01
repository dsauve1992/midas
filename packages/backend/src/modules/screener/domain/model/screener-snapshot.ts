import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export class ScreenerEntry {
  symbol: SymbolWithExchange;
  sector: string;
  industry: string;
  capitalisation: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema10: number;
  ema20: number;
  sma30: number;

  constructor(
    symbol: SymbolWithExchange,
    sector: string,
    industry: string,
    capitalisation: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    ema10: number,
    ema20: number,
    sma30: number,
  ) {
    this.symbol = symbol;
    this.sector = sector;
    this.industry = industry;
    this.capitalisation = capitalisation;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.volume = volume;
    this.ema10 = ema10;
    this.ema20 = ema20;
    this.sma30 = sma30;
  }
}

export class ScreenerSnapshot {
  readonly entries: ScreenerEntry[];

  constructor(symbols: ScreenerEntry[]) {
    this.entries = symbols;
  }

  public [Symbol.iterator](): Iterator<ScreenerEntry> {
    return this.entries[Symbol.iterator]();
  }
}
