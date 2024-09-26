import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { StockTechnicalLabeler } from '../domain/service/stock-technical-labeler';
import { AutoCommitUnitOfWork } from '../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { LabeledScreenerSymbolPostgresDbWriteRepository } from '../infra/repository/postgres/labeled-screener-symbol-postgres-db-write.repository';

@Injectable()
export class AnalyseScreenerCron {
  constructor(
    private fmpService: FinancialModelingPrepService,
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    private stockTechnicalLabeler: StockTechnicalLabeler,
    private unitOfWork: AutoCommitUnitOfWork,
  ) {}

  @Cron('1,16,31,46 * * * *', { timeZone: 'America/Montreal' })
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
      /*
       * FIXME : I have to use instanciate the repository here because of the unit of work.
       *  I should also use the TransactionalUnitOfWork instead of the AutoCommitUnitOfWork.
       *  But the TransactionalUnitOfWork require a Request scope which is not available in the cron job.
       *  This is a pretty big problem, but this related to nestjs, not my code
       * */
      const repo = new LabeledScreenerSymbolPostgresDbWriteRepository(
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
