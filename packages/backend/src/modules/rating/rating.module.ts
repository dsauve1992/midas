import { Module } from '@nestjs/common';
import { FundamentalRatingService } from './domain/service/fundamental-rating.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { TechnicalRatingService } from './domain/service/technical-rating.service';
import { AverageDailyRangeService } from './domain/service/average-daily-range.service';
import { TechnicalIndicatorService } from './domain/service/technical-indicator.service';
import { RelativeStrengthService } from './domain/service/relative-strength.service';

@Module({
  providers: [
    FundamentalRatingService,
    TechnicalRatingService,
    AverageDailyRangeService,
    RelativeStrengthService,
    TechnicalIndicatorService,
  ],
  imports: [HistoricalDataModule],
  exports: [
    FundamentalRatingService,
    TechnicalIndicatorService,
    TechnicalRatingService,
    AverageDailyRangeService,
    RelativeStrengthService,
  ],
})
export class RatingModule {}
