import { LabeledScreenerSymbol } from '../model/labeled-screener.symbol';

export interface LabeledScreenerSymbolRepository {
  save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void>;
}
