import { Module } from '@nestjs/common';
import { WatchlistDynamoDbRepository } from './infra/repository/watchlist-dynamo-db-repository';
import { WatchlistRepository } from './domain/repository/watchlist.repository';

@Module({
  providers: [
    {
      provide: WatchlistRepository,
      useClass: WatchlistDynamoDbRepository,
    },
    WatchlistDynamoDbRepository,
  ],
  exports: [WatchlistRepository],
})
export class WatchlistModule {}
