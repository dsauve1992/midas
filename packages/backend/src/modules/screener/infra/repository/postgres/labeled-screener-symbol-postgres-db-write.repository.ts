import { SymbolWithExchange } from 'src/modules/stocks/domain/symbol-with-exchange';
import { LabeledScreenerSymbol } from '../../../domain/model/labeled-screener.symbol';
import { AutoCommitUnitOfWork } from '../../../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { LabeledScreenerSymbolWriteRepository } from '../../../domain/repository/labeled-screener-symbol.write-repository';

type SymbolLabelRow = {
  title: string;
  description: string;
};

export class LabeledScreenerSymbolPostgresDbWriteRepository
  implements LabeledScreenerSymbolWriteRepository
{
  constructor(private databaseClientGetter: AutoCommitUnitOfWork) {}

  async reset(): Promise<void> {
    await this.databaseClientGetter
      .getClient()
      .query(`DELETE FROM symbol_label`);
  }

  async getBySymbol(
    symbol: SymbolWithExchange,
  ): Promise<LabeledScreenerSymbol> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<SymbolLabelRow>(
        `
        SELECT
          title,
          description
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

    if (labeledScreenerSymbol.labels.length) {
      const queryTextOrConfig = `INSERT INTO symbol_label (symbol, title, description) VALUES ${labeledScreenerSymbol.labels
        .map(
          (label) =>
            `('${labeledScreenerSymbol.symbol.toString()}', '${label.title}', '${label.description}')`,
        )
        .join(',')}`;

      await this.databaseClientGetter.getClient().query(queryTextOrConfig);
    }
  }
}
