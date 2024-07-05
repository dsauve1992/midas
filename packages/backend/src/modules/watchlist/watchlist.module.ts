import { Module } from '@nestjs/common';
import { WatchlistRepository } from './domain/repository/watchlist.repository';
import { ConfigModule } from '@nestjs/config';
import { AddSymbolToWatchlistUseCase } from './usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from './usecase/remove-symbol-from-watchlist.use-case';
import { WatchlistController } from './controller/watchlist.controller';
import { GetWatchlistUseCase } from './usecase/get-watchlist.use-case';
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
    AddSymbolToWatchlistUseCase,
    RemoveSymbolFromWatchlistUseCase,
    GetWatchlistUseCase,
  ],
  exports: [WatchlistRepository],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
