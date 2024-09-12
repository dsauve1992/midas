import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { AutoCommitUnitOfWork } from '../../unit-of-work/auto-commit-unit-of-work.service';
import { Pool } from 'pg';

@Injectable()
export class IntegrationTestService {
  constructor(
    @Inject('KNEX') private readonly knex: Knex,
    @Inject('UNIT_OF_WORK') private readonly unitOfWork: AutoCommitUnitOfWork,
    @Inject('PG_CONNECTION_POOL') private readonly _pool: Pool,
  ) {}

  get pool(): Pool {
    return this._pool;
  }

  async start() {
    await this.knex.migrate.latest();
    await this.unitOfWork.connect();
  }

  async stop() {
    await this.unitOfWork.release();
    await this._pool.end();
    await this.knex.destroy();
  }
}
