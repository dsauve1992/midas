import { Inject, Injectable } from '@nestjs/common';
import { StockTechnicalLabeler } from '../domain/service/stock-technical-labeler';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { LabeledScreenerSymbolPostgresDbRepository } from '../infra/repository/postgres/labeled-screener-symbol-postgres-db.repository';
import { AutoCommitUnitOfWork } from '../../../lib/unit-of-work/auto-commit-unit-of-work.service';

@Injectable()
export class AnalyseScreenerElementsUseCase {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    private stockTechnicalLabeler: StockTechnicalLabeler,
    private unitOfWork: AutoCommitUnitOfWork,
  ) {}

  async execute(): Promise<void> {
    await this.unitOfWork.connect();

    try {
      const repo = new LabeledScreenerSymbolPostgresDbRepository(
        this.unitOfWork,
      );
      const snapshot = await this.screenerRepository.search();

      for (const symbol of snapshot) {
        try {
          console.log(`Analysing symbol: ${symbol.toString()}`);
          const labeledSymbol = await repo.getBySymbol(symbol);

          const labels = await this.stockTechnicalLabeler.for(symbol);

          labeledSymbol.updateLabels(labels);

          await repo.save(labeledSymbol);
        } catch (error) {
          console.error(`Error analysing symbol: ${symbol.toString()}`, error);
        }
      }
    } finally {
      await this.unitOfWork.release();
    }
  }
}
