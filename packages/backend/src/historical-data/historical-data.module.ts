import { Module } from '@nestjs/common';
import { HistoricalDataController } from './historical-data.controller';
import { HttpModule } from '@nestjs/axios';
import { FinancialModelingPrepFetcherClient } from './financial-modeling-prep-fetcher-client.service';

@Module({
  controllers: [HistoricalDataController],
  imports: [HttpModule],
  providers: [FinancialModelingPrepFetcherClient],
  exports: [FinancialModelingPrepFetcherClient],
})
export class HistoricalDataModule {}
