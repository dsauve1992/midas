import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { HistoricalDataModule } from '../historical-data/historical-data.module';

@Module({
  controllers: [StocksController],
  imports: [HistoricalDataModule],
})
export class StocksModule {}
