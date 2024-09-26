import { SymbolWithExchange } from 'src/modules/stocks/domain/symbol-with-exchange';
import { LabeledScreenerSymbol } from '../../../domain/model/labeled-screener.symbol';
import { LabeledScreenerSymbolReadRepository } from '../../../domain/repository/labeled-screener-symbol.read-repository';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';
import { chain } from 'lodash';
import { Inject } from '@nestjs/common';

type SymbolLabelRow = {
  title: string;
  description: string;
};

export class LabeledScreenerSymbolPostgresDbReadRepository
  implements LabeledScreenerSymbolReadRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  async getAll(): Promise<LabeledScreenerSymbol[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<SymbolLabelRow>(
        `
        SELECT
          symbol,
          title,
          description
        FROM symbol_label 
        `,
      );

    return chain(rows)
      .groupBy('symbol')
      .toPairs()
      .map(([symbol, rows]) => {
        return new LabeledScreenerSymbol(SymbolWithExchange.from(symbol), rows);
      })
      .value();
  }
}
