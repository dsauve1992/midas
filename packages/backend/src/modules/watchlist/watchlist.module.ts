import { Module } from '@nestjs/common';
import { WatchlistDynamoDbRepository } from './infra/repository/watchlist-dynamo-db.repository';
import { WatchlistRepository } from './domain/repository/watchlist.repository';
import { ConfigModule } from '@nestjs/config';
import { AddSymbolToWatchlistUseCase } from './usecase/add-symbol-to-watchlist.use-case';
import { RemoveSymbolFromWatchlistUseCase } from './usecase/remove-symbol-from-watchlist.use-case';
import { WatchlistControllerController } from './controller/watchlist-controller.controller';
import { GetWatchlistUseCase } from './usecase/get-watchlist.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: WatchlistRepository,
      useClass: WatchlistDynamoDbRepository,
    },
    AddSymbolToWatchlistUseCase,
    RemoveSymbolFromWatchlistUseCase,
    GetWatchlistUseCase,
  ],
  exports: [WatchlistRepository],
  controllers: [WatchlistControllerController],
})
export class WatchlistModule {}
