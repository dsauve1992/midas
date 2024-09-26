import { LabeledScreenerSymbol } from '../model/labeled-screener.symbol';
import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export interface LabeledScreenerSymbolRepository {
  save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void>;
  getBySymbol(symbol: SymbolWithExchange): Promise<LabeledScreenerSymbol>;
}
