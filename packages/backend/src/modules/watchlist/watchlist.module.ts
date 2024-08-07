import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddSymbolToWatchlistUseCase } from './usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from './usecase/remove-symbol-from-watchlist.use-case';
import { WatchlistController } from './controller/watchlist.controller';
import { GetWatchlistsUseCase } from './usecase/get-watchlists-use-case';
import { WatchlistPostgresDbRepository } from './infra/repository/postgres/watchlist-postgres-db.repository';
import { CreateWatchlistUseCase } from './usecase/create-watchlist.use-case';
import { DeleteWatchlistUseCase } from './usecase/delete-watchlist.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'WatchlistReadOnlyRepository',
      useClass: WatchlistPostgresDbRepository,
    },
    {
      provide: 'WatchlistWriteRepository',
      useClass: WatchlistPostgresDbRepository,
    },
    AddSymbolToWatchlistUseCase,
    RemoveSymbolFromWatchlistUseCase,
    CreateWatchlistUseCase,
    DeleteWatchlistUseCase,
    GetWatchlistsUseCase,
  ],
  exports: ['WatchlistReadOnlyRepository', 'WatchlistWriteRepository'],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
