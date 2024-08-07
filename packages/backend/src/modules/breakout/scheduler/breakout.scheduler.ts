import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CheckForBreakoutUseCase } from '../usecase/check-for-breakout.use-case';
import { BreakoutService } from '../domain/breakout.service';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { Pool } from 'pg';

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

    /*
FIXME : in the context of a cron job, we cannot use nestjs dependency injection mecanism
 because UnitOFWork need to be Request scoped (But what is a Request in the context of a cron job ?).
 So we need to create the unit of work by ourselves and inject that same instance into any dependency that needs it.
 But it's ok to use the dependency injection mecanism for the other dependencies.
 */
    const checkForBreakoutUseCase = new CheckForBreakoutUseCase(
      this.breakoutService,
      this.fmpService,
      unitOfWork,
    );

    await checkForBreakoutUseCase.execute();
  }
}
