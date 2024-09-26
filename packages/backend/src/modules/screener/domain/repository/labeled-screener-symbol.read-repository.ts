import { LabeledScreenerSymbol } from '../model/labeled-screener.symbol';

export interface LabeledScreenerSymbolReadRepository {
  getAll(): Promise<LabeledScreenerSymbol[]>;
}
