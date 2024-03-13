import { Module } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from './usecase/compute-fundamental-rating.use-case';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { ComputeTechnicalRatingUseCase } from './usecase/compute-technical-rating.use-case';
import { ComputeAverageDailyRangeUseCase } from './usecase/compute-average-daily-range.use-case';
import { TechnicalIndicatorService } from './domain/service/technical-indicator.service';
import { ComputeRelativeStrengthUseCase } from './usecase/compute-relative-strength.use-case';

@Module({
  providers: [
    ComputeFundamentalRatingUseCase,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
    ComputeRelativeStrengthUseCase,
    TechnicalIndicatorService,
  ],
  imports: [HistoricalDataModule],
  exports: [
    ComputeFundamentalRatingUseCase,
    TechnicalIndicatorService,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
    ComputeRelativeStrengthUseCase,
  ],
})
export class RatingModule {}
