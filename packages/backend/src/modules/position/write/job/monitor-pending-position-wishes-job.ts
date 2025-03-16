import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase } from '../usecase/check-for-reached-entry-price-related-to-pending-position-wishes-use-case';

@Injectable()
export class MonitorPendingPositionWishesJob {
  private readonly logger = new Logger(MonitorPendingPositionWishesJob.name);

  constructor(
    private readonly checkForReachedEntryPriceRelatedToPendingPositionWishesUseCase: CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase,
  ) {}

  @Cron('0 */15 * * 1-5')
  async run() {
    this.logger.debug('start job');
    await this.checkForReachedEntryPriceRelatedToPendingPositionWishesUseCase.execute();
    this.logger.debug('end job');
  }
}
