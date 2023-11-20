import { Module } from '@nestjs/common';
import { BreakoutService } from './domain/breakout.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';
import { BreakoutScheduler } from './scheduler/breakout.scheduler';
import { WatchlistModule } from '../watchlist/watchlist.module';

@Module({
  providers: [BreakoutService, CheckForBreakoutUseCase, BreakoutScheduler],
  imports: [HistoricalDataModule, WatchlistModule],
})
export class BreakoutModule {}
