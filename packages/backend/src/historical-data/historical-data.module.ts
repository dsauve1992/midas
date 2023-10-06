import { Module } from '@nestjs/common';
import { HistoricalDataController } from './historical-data.controller';
import { HttpModule } from '@nestjs/axios';
import { FinancialModelingPrepService } from './financial-modeling-prep.service';

@Module({
  controllers: [HistoricalDataController],
  imports: [HttpModule],
  providers: [FinancialModelingPrepService],
  exports: [FinancialModelingPrepService],
})
export class HistoricalDataModule {}
