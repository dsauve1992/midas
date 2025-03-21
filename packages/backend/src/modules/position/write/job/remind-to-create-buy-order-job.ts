import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PositionWishPostgresDbRepository } from '../infra/repository/position-wish.postgres-db.repository';
import { AutoCommitUnitOfWork } from '../../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { TelegramService } from '../../../telegram/telegram.service';
import { RemindToCreateBuyOrderUseCase } from '../usecase/remind-to-create-buy-order-use-case';

@Injectable()
export class RemindToCreateBuyOrderJob {
  private readonly logger = new Logger(RemindToCreateBuyOrderJob.name);

  constructor(
    private readonly autoCommitUnitOfWork: AutoCommitUnitOfWork,
    private readonly bot: TelegramService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async run() {
    this.logger.debug('start job');
    try {
      await this.autoCommitUnitOfWork.connect();
      const useCase = new RemindToCreateBuyOrderUseCase(
        new PositionWishPostgresDbRepository(this.autoCommitUnitOfWork),
        this.bot,
      );
      await useCase.execute();
    } finally {
      await this.autoCommitUnitOfWork.release();
    }
    this.logger.debug('end job');
  }
}
