interface StockBreakoutEvent {
  symbol: string;
  date: Date;
  toString(): string;
}

export interface BreakoutStrategy {
  checkFor(symbol: string): Promise<StockBreakoutEvent | null>;
}
