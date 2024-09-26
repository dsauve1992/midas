import { LabeledScreenerSymbol } from '../model/labeled-screener.symbol';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export interface LabeledScreenerSymbolWriteRepository {
  reset(): Promise<void>;
  save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void>;
  getBySymbol(symbol: SymbolWithExchange): Promise<LabeledScreenerSymbol>;
}
