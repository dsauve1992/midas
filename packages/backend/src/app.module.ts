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
import { BreakoutModule } from './modules/breakout/breakout.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UnitOfWorkModule } from './lib/unitOfWorkModule';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    BreakoutModule,
    WatchlistModule,
    TelegramModule,
    UnitOfWorkModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
