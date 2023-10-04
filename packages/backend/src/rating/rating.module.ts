import { Module } from '@nestjs/common';
import { RatingService } from './usecase/rating.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { ScreenerModule } from '../screener/screener.module';
import { RatingController } from './controller/rating.controller';
import { ComputeRatingScheduler } from './scheduler/compute-rating.scheduler';

@Module({
  providers: [RatingService, ComputeRatingScheduler],
  imports: [HistoricalDataModule, ScreenerModule],
  controllers: [RatingController],
})
export class RatingModule {}
