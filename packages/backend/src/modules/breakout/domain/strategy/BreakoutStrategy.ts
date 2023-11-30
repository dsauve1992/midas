import { StockBreakoutEvent } from '../event/stock-breakout.event';

export interface BreakoutStrategy {
  checkFor(symbol: string): Promise<StockBreakoutEvent | null>;
}
