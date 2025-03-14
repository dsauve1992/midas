import { Module } from '@nestjs/common';
import { HistoricalDataModule } from './modules/historical-data/historical-data.module';
import { ConfigModule } from '@nestjs/config';
import { OwnershipModule } from './modules/ownership/ownership.module';
import { ScreenerModule } from './modules/screener/screener.module';
import { InvestorsBusinessDailyModule } from './modules/investors-business-daily/investors-business-daily.module';
import { RatingModule } from './modules/rating/rating.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StocksModule } from './modules/stocks/stocks.module';
import { SearchModule } from './modules/search/search.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { AppController } from './app.controller';
import { UnitOfWorkModule } from './lib/unit-of-work/unit-of-work.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { PositionModule } from './modules/position/position.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HistoricalDataModule,
    OwnershipModule,
    ScreenerModule,
    InvestorsBusinessDailyModule,
    RatingModule,
    StocksModule,
    SearchModule,
    AuthorizationModule,
    WatchlistModule,
    UnitOfWorkModule,
    PositionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
