import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AutoCommitUnitOfWork } from '../../../lib/unit-of-work/auto-commit-unit-of-work.service';
import { LabeledScreenerSymbolWriteRepository } from '../domain/repository/labeled-screener-symbol.write-repository';
import { LabeledScreenerSymbolPostgresDbWriteRepository } from '../infra/repository/postgres/labeled-screener-symbol-postgres-db-write.repository';

@Injectable()
export class RemoveOldScreenerElementCron {
  constructor(private unitOfWork: AutoCommitUnitOfWork) {}

  @Cron('29 9 * * *', { timeZone: 'America/Montreal' })
  async handleCron() {
    await this.execute();
  }

  private async execute(): Promise<void> {
    await this.unitOfWork.connect();

    /*
     * FIXME : I have to use instanciate the repository here because of the unit of work.
     *  I should also use the TransactionalUnitOfWork instead of the AutoCommitUnitOfWork.
     *  But the TransactionalUnitOfWork require a Request scope which is not available in the cron job.
     *  This is a pretty big problem, but this related to nestjs, not my code
     * */

    try {
      const repository: LabeledScreenerSymbolWriteRepository =
        new LabeledScreenerSymbolPostgresDbWriteRepository(this.unitOfWork);

      await repository.reset();
    } finally {
      await this.unitOfWork.release();
    }
  }
}
