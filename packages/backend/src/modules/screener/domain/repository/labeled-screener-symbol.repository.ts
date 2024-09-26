import { LabeledScreenerSymbol } from '../model/labeled-screener.symbol';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { ScreenerSnapshot } from '../model/screener-snapshot';

export interface LabeledScreenerSymbolRepository {
  save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void>;
  getSnapshot(): Promise<ScreenerSnapshot>; // TODO should be declared in a different interface
  getBySymbol(symbol: SymbolWithExchange): Promise<LabeledScreenerSymbol>;
}
