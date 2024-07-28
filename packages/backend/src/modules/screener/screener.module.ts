import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradingViewScreenerService } from './infra/trading-view/trading-view-screener.service';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { TelegramModule } from '../telegram/telegram.module';
import { ScreenerRestController } from './controller/screener.rest.controller';

@Module({
  controllers: [ScreenerRestController],
  imports: [HttpModule, RatingModule, HistoricalDataModule, TelegramModule],
  providers: [TradingViewScreenerService],
})
export class ScreenerModule {}
