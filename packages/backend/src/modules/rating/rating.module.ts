import { Module } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from './usecase/compute-fundamental-rating.use-case';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { ComputeTechnicalRatingUseCase } from './usecase/compute-technical-rating.use-case';
import { ComputeAverageDailyRangeUseCase } from './usecase/compute-average-daily-range.use-case';
import { TechnicalIndicatorService } from './domain/service/technical-indicator.service';
import { CheckTechnicalSetupService } from './domain/service/check-technical-setup.service';

@Module({
  providers: [
    ComputeFundamentalRatingUseCase,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
    TechnicalIndicatorService,
    CheckTechnicalSetupService,
  ],
  imports: [HistoricalDataModule],
  exports: [
    ComputeFundamentalRatingUseCase,
    TechnicalIndicatorService,
    ComputeTechnicalRatingUseCase,
    ComputeAverageDailyRangeUseCase,
    CheckTechnicalSetupService,
  ],
})
export class RatingModule {}
