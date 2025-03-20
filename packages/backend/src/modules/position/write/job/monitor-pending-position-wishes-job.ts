import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase } from '../usecase/check-for-reached-entry-price-related-to-pending-position-wishes-use-case';
import { PositionWishPostgresDbRepository } from '../infra/repository/position-wish.postgres-db.repository';
import { AutoCommitUnitOfWork } from '../../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';
import { OngoingPositionPostgresDbRepository } from '../infra/repository/ongoing-position.postgres-db.repository';

@Injectable()
export class MonitorPendingPositionWishesJob {
  private readonly logger = new Logger(MonitorPendingPositionWishesJob.name);

  constructor(
    private readonly autoCommitUnitOfWork: AutoCommitUnitOfWork,
    private readonly bot: TelegramService,
    private readonly historicalPriceService: HistoricalPriceService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async run() {
    this.logger.debug('start job');
    try {
      await this.autoCommitUnitOfWork.connect();
      const useCase =
        new CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase(
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
