import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { TechnicalLabel } from './technical-label';

export class LabeledScreenerSymbol {
  private _deleted: boolean;

  constructor(
    public readonly symbol: SymbolWithExchange,
    private _labels: TechnicalLabel[],
  ) {
    this._deleted = false;
  }

  get labels(): TechnicalLabel[] {
    return this._labels;
  }

  updateLabels(labels: TechnicalLabel[]): void {
    this._labels = labels;
  }

  get deleted(): boolean {
    return this._deleted;
  }

  delete(): void {
    this._deleted = true;
  }
}
