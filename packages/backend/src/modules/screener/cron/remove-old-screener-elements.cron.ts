import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { AutoCommitUnitOfWork } from '../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { LabeledScreenerSymbolRepository } from '../domain/repository/labeled-screener-symbol.repository';
import { LabeledScreenerSymbolPostgresDbRepository } from '../infra/repository/postgres/labeled-screener-symbol-postgres-db.repository';

@Injectable()
export class RemoveOldScreenerElementCron {
  constructor(
    private fmpService: FinancialModelingPrepService,
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    private unitOfWork: AutoCommitUnitOfWork,
  ) {}

  @Cron('1,16,31,46 * * * *')
  async handleCron() {
    const { isTheStockMarketOpen } =
      await this.fmpService.getMarketOpeningInformation();

    if (isTheStockMarketOpen) {
      console.log('RemoveOldScreenerElementCron');
      await this.execute();
    }
  }

  private async execute(): Promise<void> {
    await this.unitOfWork.connect();

    try {
      const repository: LabeledScreenerSymbolRepository =
        new LabeledScreenerSymbolPostgresDbRepository(this.unitOfWork);

      const yesterdaySnapshot = await repository.getSnapshot();
      const latestSnapshot = await this.screenerRepository.search();

      const snapshotDifference =
        latestSnapshot.differenceFrom(yesterdaySnapshot);

      for (const symbol of snapshotDifference.removedSymbols) {
        try {
          const labeledSymbol = await repository.getBySymbol(symbol);

          console.log(`Removing symbol: ${symbol.toString()}`);
          labeledSymbol.delete();

          await repository.save(labeledSymbol);
        } catch (error) {
          console.error(`Error set symbol as new: ${symbol.toString()}`, error);
        }
      }
    } finally {
      await this.unitOfWork.release();
    }
  }
}
