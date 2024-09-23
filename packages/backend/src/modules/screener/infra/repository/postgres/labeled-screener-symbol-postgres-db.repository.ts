import { LabeledScreenerSymbol } from '../../../domain/model/labeled-screener.symbol';
import { LabeledScreenerSymbolRepository } from '../../../domain/repository/labeled-screener-symbol.repository';

export class LabeledScreenerSymbolPostgresDbRepository
  implements LabeledScreenerSymbolRepository
{
  save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void> {
    console.log(labeledScreenerSymbol);
    return;
  }
}
