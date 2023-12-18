import { Module } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from './usecase/compute-fundamental-rating.use-case';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { ComputeTechnicalRatingUseCase } from './usecase/compute-technical-rating.use-case';
import { ComputeAverageDailyRangeUseCase } from './usecase/compute-average-daily-range.use-case';

@Module({
  providers: [
    ComputeFundamentalRatingUseCase,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
  ],
  imports: [HistoricalDataModule],
  exports: [
    ComputeFundamentalRatingUseCase,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
  ],
})
export class RatingModule {}
