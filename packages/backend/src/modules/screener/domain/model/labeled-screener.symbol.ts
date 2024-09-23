import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { TechnicalLabel } from './technical-label';

export class LabeledScreenerSymbol {
  constructor(
    public readonly symbol: SymbolWithExchange,
    public readonly labels: TechnicalLabel[],
  ) {}
}
