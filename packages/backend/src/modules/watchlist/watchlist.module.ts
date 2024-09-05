import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddSymbolToWatchlistUseCase } from './usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from './usecase/remove-symbol-from-watchlist.use-case';
import { WatchlistController } from './controller/watchlist.controller';
import { GetWatchlistsUseCase } from './usecase/get-watchlists.use-case';
import { WatchlistPostgresDbRepository } from './infra/repository/postgres/watchlist-postgres-db.repository';
import { CreateWatchlistUseCase } from './usecase/create-watchlist.use-case';
import { DeleteWatchlistUseCase } from './usecase/delete-watchlist.use-case';
import { UserWatchlistsAggregatePostgresDbRepository } from './infra/repository/postgres/user-watchlists-aggregate-postgres-db.repository';
import { RenameWatchlistUseCase } from './usecase/rename-watchlist.use-case';

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
    {
      provide: 'UserWatchlistsAggregateRepository',
      useClass: UserWatchlistsAggregatePostgresDbRepository,
    },
    AddSymbolToWatchlistUseCase,
    RemoveSymbolFromWatchlistUseCase,
    CreateWatchlistUseCase,
    RenameWatchlistUseCase,
    DeleteWatchlistUseCase,
    GetWatchlistsUseCase,
  ],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
