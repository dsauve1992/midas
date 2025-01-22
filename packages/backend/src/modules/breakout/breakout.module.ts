import { Module } from '@nestjs/common';
import { BreakoutService } from './domain/breakout.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';
import { BreakoutScheduler } from './scheduler/breakout.scheduler';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { BreakoutEventListener } from './listener/breakout-event.listener';

@Module({
  providers: [
    BreakoutService,
    CheckForBreakoutUseCase,
    BreakoutScheduler,
    BreakoutEventListener,
  ],
  imports: [HistoricalDataModule, WatchlistModule],
})
export class BreakoutModule {}
