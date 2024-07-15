import { Global, Module, Scope } from '@nestjs/common';
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
        max: 10,
      }),
    },
    {
      provide: 'UNIT_OF_WORK',
      useClass: TransactionalUnitOfWork,
      scope: Scope.REQUEST,
    },
    TransactionalUnitOfWork,
    AutoCommitUnitOfWork,
  ],
  exports: [
    TransactionalUnitOfWork,
    AutoCommitUnitOfWork,
    'UNIT_OF_WORK',
    'PG_CONNECTION_POOL',
  ],
})
export class UnitOfWorkModule {}
