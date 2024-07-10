import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { TransactionalUnitOfWork } from './transactional-unit-of-work.service';
import { AutoCommitUnitOfWork } from './auto-commit-unit-of-work.service';

@Global()
@Module({
  controllers: [],
  providers: [
    {
      provide: 'PG_CONNECTION_POOL',
      useValue: new Pool({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
        idleTimeoutMillis: 0,
        connectionTimeoutMillis: 0,
        max: 1,
      }),
    },
    {
      provide: 'UNIT_OF_WORK',
      useClass: TransactionalUnitOfWork,
    },
    TransactionalUnitOfWork,
    AutoCommitUnitOfWork,
  ],
  exports: [TransactionalUnitOfWork, AutoCommitUnitOfWork],
})
export class LibModule {}
