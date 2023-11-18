import { Module } from '@nestjs/common';
import { HistoricalDataModule } from './historical-data/historical-data.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './ownership/ownership.module';
import { TranscriptModule } from './transcript/transcript.module';
import { ScreenerModule } from './screener/screener.module';
import { InvestorsBusinessDailyModule } from './investors-business-daily/investors-business-daily.module';
import { RatingModule } from './rating/rating.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StocksModule } from './stocks/stocks.module';
import { SearchModule } from './search/search.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { BreakoutModule } from './breakout/breakout.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HistoricalDataModule,
    OwnershipModule,
    TranscriptModule,
    ScreenerModule,
    InvestorsBusinessDailyModule,
    RatingModule,
    StocksModule,
    SearchModule,
    AuthorizationModule,
    BreakoutModule,
    WatchlistModule,
  ],
  controllers: [],
})
export class AppModule {}
