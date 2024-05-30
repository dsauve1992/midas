import { Module } from '@nestjs/common';
import { WatchlistRepository } from './domain/repository/watchlist.repository';
import { ConfigModule } from '@nestjs/config';
import { AddSymbolToWatchlistUseCase } from './usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from './usecase/remove-symbol-from-watchlist.use-case';
import { WatchlistController } from './controller/watchlist.controller';
import { GetWatchlistUseCase } from './usecase/get-watchlist.use-case';
import { Pool } from 'pg';
import { WatchlistPostgresDbRepository } from './infra/repository/postgres/watchlist-postgres-db.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: WatchlistRepository,
      useClass: WatchlistPostgresDbRepository,
    },
    {
      provide: 'PG_CONNECTION_POOL',
      useValue: new Pool({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
        idleTimeoutMillis: 0,
        connectionTimeoutMillis: 0,
        max: 1,
      }),
    },
    AddSymbolToWatchlistUseCase,
    RemoveSymbolFromWatchlistUseCase,
    GetWatchlistUseCase,
  ],
  exports: [WatchlistRepository],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
