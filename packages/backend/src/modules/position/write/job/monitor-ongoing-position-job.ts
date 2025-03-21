import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AutoCommitUnitOfWork } from '../../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';

@Injectable()
export class MonitorOngoingPositionJob {
  private readonly logger = new Logger(MonitorOngoingPositionJob.name);

  constructor(
    private readonly autoCommitUnitOfWork: AutoCommitUnitOfWork,
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
    } finally {
      await this.autoCommitUnitOfWork.release();
    }
    this.logger.debug('end job');
  }
}
