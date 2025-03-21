import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonitorPendingPositionWishesUseCase } from '../usecase/monitor-pending-position-wishes.use-case';
import { PositionWishPostgresDbRepository } from '../infra/repository/position-wish.postgres-db.repository';
import { AutoCommitUnitOfWork } from '../../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';
import { OngoingPositionPostgresDbRepository } from '../infra/repository/ongoing-position.postgres-db.repository';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';

@Injectable()
export class MonitorPendingPositionWishesJob {
  private readonly logger = new Logger(MonitorPendingPositionWishesJob.name);

  constructor(
    private readonly autoCommitUnitOfWork: AutoCommitUnitOfWork,
    private readonly bot: TelegramService,
    private readonly historicalPriceService: HistoricalPriceService,
    private readonly financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  @Cron('*/15 9-16 * * 1-5')
  async run() {
    this.logger.debug('start job');

    const { isTheStockMarketOpen } =
      await this.financialModelingPrepService.getMarketOpeningInformation();

    if (!isTheStockMarketOpen) {
      return;
    }

    try {
      await this.autoCommitUnitOfWork.connect();
      const useCase = new MonitorPendingPositionWishesUseCase(
        new PositionWishPostgresDbRepository(this.autoCommitUnitOfWork),
        new OngoingPositionPostgresDbRepository(this.autoCommitUnitOfWork),
        this.historicalPriceService,
        this.bot,
      );
      await useCase.execute();
    } catch (e) {
      await this.autoCommitUnitOfWork.release();
    }
    this.logger.debug('end job');
  }
}
