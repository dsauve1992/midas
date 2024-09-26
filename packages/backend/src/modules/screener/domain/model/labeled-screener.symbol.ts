import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { TechnicalLabel } from './technical-label';

export class LabeledScreenerSymbol {
  constructor(
    public readonly symbol: SymbolWithExchange,
    private _labels: TechnicalLabel[],
  ) {}

  get labels(): TechnicalLabel[] {
    return this._labels;
  }

  updateLabels(labels: TechnicalLabel[]): void {
    this._labels = labels;
  }
}
