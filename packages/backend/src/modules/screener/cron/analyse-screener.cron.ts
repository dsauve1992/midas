import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { StockTechnicalLabeler } from '../domain/service/stock-technical-labeler';
import { AutoCommitUnitOfWork } from '../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { LabeledScreenerSymbolPostgresDbRepository } from '../infra/repository/postgres/labeled-screener-symbol-postgres-db.repository';

@Injectable()
export class AnalyseScreenerCron {
  constructor(
    private fmpService: FinancialModelingPrepService,
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    private stockTechnicalLabeler: StockTechnicalLabeler,
    private unitOfWork: AutoCommitUnitOfWork,
  ) {}

  @Cron('1,16,31,46 * * * *')
  async handleCron() {
    const { isTheStockMarketOpen } =
      await this.fmpService.getMarketOpeningInformation();

    if (isTheStockMarketOpen) {
      await this.execute();
    }
  }

  private async execute(): Promise<void> {
    await this.unitOfWork.connect();

    try {
      const repo = new LabeledScreenerSymbolPostgresDbRepository(
        this.unitOfWork,
      );
      const snapshot = await this.screenerRepository.search();

      for (const symbol of snapshot) {
        try {
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
