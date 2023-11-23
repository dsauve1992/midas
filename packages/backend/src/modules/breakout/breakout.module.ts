import { Module } from '@nestjs/common';
import { BreakoutService } from './domain/breakout.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';
import { BreakoutScheduler } from './scheduler/breakout.scheduler';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { InitialAssignmentCreatedListener } from './listener/breakout-event.listener';

@Module({
  providers: [
    BreakoutService,
    CheckForBreakoutUseCase,
    BreakoutScheduler,
    InitialAssignmentCreatedListener,
  ],
  imports: [HistoricalDataModule, WatchlistModule],
})
export class BreakoutModule {}
