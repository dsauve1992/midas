import { Module } from '@nestjs/common';
import { BreakoutService } from './domain/breakout.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';

@Module({
  providers: [BreakoutService, CheckForBreakoutUseCase],
  imports: [HistoricalDataModule],
})
export class BreakoutModule {}
