import { SymbolWithExchange } from 'src/modules/stocks/domain/symbol-with-exchange';
import { LabeledScreenerSymbol } from '../../../domain/model/labeled-screener.symbol';
import { LabeledScreenerSymbolRepository } from '../../../domain/repository/labeled-screener-symbol.repository';
import { Inject } from '@nestjs/common';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';

type SymbolLabelRow = {
  title: string;
  description: string;
};

export class LabeledScreenerSymbolPostgresDbRepository
  implements LabeledScreenerSymbolRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  async getBySymbol(
    symbol: SymbolWithExchange,
  ): Promise<LabeledScreenerSymbol> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<SymbolLabelRow>(
        `
        SELECT
          title as title,
          description as description
        FROM symbol_label 
        WHERE symbol = $1
        `,
        [symbol.toString()],
      );

    return new LabeledScreenerSymbol(symbol, rows);
  }

  async save(labeledScreenerSymbol: LabeledScreenerSymbol): Promise<void> {
    await this.databaseClientGetter
      .getClient()
      .query(
        `DELETE FROM symbol_label WHERE symbol = '${labeledScreenerSymbol.symbol.toString()}'`,
      );

    await this.databaseClientGetter.getClient().query(
      `INSERT INTO symbol_label (symbol, title, description) VALUES ${Array.from(
        labeledScreenerSymbol.labels,
      )
        .map(
          (label) =>
            `('${labeledScreenerSymbol.symbol.toString()}', '${label.title}', '${label.description}')`,
        )
        .join(',')}`,
    );
  }
}
