import { Module } from '@nestjs/common';
import { RatingService } from './usecase/rating.service';
import { FinancialModelingPrepModule } from '../financial-modeling-prep/financial-modeling-prep.module';
import { ScreenerModule } from '../screener/screener.module';
import { RatingController } from './controller/rating.controller';
import { ComputeRatingScheduler } from './scheduler/compute-rating.scheduler';

@Module({
  providers: [RatingService, ComputeRatingScheduler],
  imports: [FinancialModelingPrepModule, ScreenerModule],
  controllers: [RatingController],
})
export class RatingModule {}
