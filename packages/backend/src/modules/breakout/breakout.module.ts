import { Module } from '@nestjs/common';
import { BreakoutService } from './domain/breakout.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { CheckForBreakoutUseCase } from './usecase/check-for-breakout.use-case';
import { BreakoutScheduler } from './scheduler/breakout.scheduler';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { InitialAssignmentCreatedListener } from './listener/breakout-event.listener';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [
    BreakoutService,
    CheckForBreakoutUseCase,
    BreakoutScheduler,
    InitialAssignmentCreatedListener,
  ],
  imports: [HistoricalDataModule, WatchlistModule, NotificationModule],
})
export class BreakoutModule {}
