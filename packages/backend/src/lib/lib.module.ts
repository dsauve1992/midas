import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { UnitOfWork } from './unit-of-work';

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
    UnitOfWork,
  ],
  exports: [UnitOfWork],
})
export class LibModule {}
