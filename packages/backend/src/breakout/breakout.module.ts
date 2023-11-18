import { Module } from '@nestjs/common';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';
import { HistoricalDataModule } from '../historical-data/historical-data.module';

@Module({
  providers: [CheckForBreakoutUseCase],
  imports: [HistoricalDataModule],
})
export class BreakoutModule {}
