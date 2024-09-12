import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradingViewScreenerService } from './infra/trading-view/trading-view-screener.service';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { TelegramModule } from '../telegram/telegram.module';
import { ScreenerRestController } from './controller/screener.rest.controller';
import { ScreenerCronService } from './cron/screener-cron.service';

import { StockAnalyser } from './domain/stock-analyser';

@Module({
  controllers: [ScreenerRestController],
  imports: [
    HttpModule,
    RatingModule,
    HistoricalDataModule,
    TelegramModule,
    ScreenerCronService,
  ],
  providers: [TradingViewScreenerService, StockAnalyser],
})
export class ScreenerModule {}
