import { Module } from '@nestjs/common';
import { WatchlistDynamoDbRepository } from './infra/repository/watchlist-dynamo-db.repository';
import { WatchlistRepository } from './domain/repository/watchlist.repository';
import { ConfigModule } from '@nestjs/config';

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
  ],
  exports: [WatchlistRepository],
})
export class WatchlistModule {}
