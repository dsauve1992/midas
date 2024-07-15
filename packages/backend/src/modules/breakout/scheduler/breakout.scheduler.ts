import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CheckForBreakoutUseCase } from '../usecase/check-for-breakout.use-case';
import { BreakoutService } from '../domain/breakout.service';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { Pool } from 'pg';
import { WatchlistPostgresDbRepository } from '../../watchlist/infra/repository/postgres/watchlist-postgres-db.repository';

@Injectable()
export class BreakoutScheduler {
  constructor(
    private breakoutService: BreakoutService,
    private fmpService: FinancialModelingPrepService,
    @Inject('PG_CONNECTION_POOL') private readonly pool: Pool,
  ) {}

  @Cron('*/15 9-16 * * 1-5', { timeZone: 'America/Montreal' })
  async handleCron() {
    const unitOfWork = new TransactionalUnitOfWork(this.pool);

    const checkForBreakoutUseCase = new CheckForBreakoutUseCase(
      this.breakoutService,
      new WatchlistPostgresDbRepository(unitOfWork),
      this.fmpService,
      unitOfWork,
    );

    await checkForBreakoutUseCase.execute();
  }
}
