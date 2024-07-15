import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';
import { ScreenerEntryFactory } from '../domain/screener-entry.factory';
import { UpdateScreenerUseCase } from '../usecase/update-screener.use-case';
import { ScreenerPostgresDbRepository } from '../infra/repository/postgres/screener-postgres-db.repository';
import { Pool } from 'pg';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

@Injectable()
export class UpdateScreenerCronJobController {
  constructor(
    private screenerFetcherService: TradingViewScreenerService,
    private screenerEntryFactory: ScreenerEntryFactory,
    @Inject('PG_CONNECTION_POOL') private readonly pool: Pool,
  ) {}

  @Cron('30 17 * * *', { timeZone: 'America/Montreal' })
  async handleJob() {
    const unitOfWork = new TransactionalUnitOfWork(this.pool);

    await new UpdateScreenerUseCase(
      this.screenerFetcherService,
      new ScreenerPostgresDbRepository(unitOfWork),
      this.screenerEntryFactory,
      unitOfWork,
    ).execute();
  }
}
