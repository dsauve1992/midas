import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { InvestorsBusinessDailyModule } from '../investors-business-daily/investors-business-daily.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  controllers: [StocksController],
  imports: [HistoricalDataModule, InvestorsBusinessDailyModule, RatingModule],
})
export class StocksModule {}
