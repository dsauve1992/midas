import { Module } from '@nestjs/common';
import { FundamentalRatingService } from './domain/service/fundamental-rating.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { TechnicalRatingService } from './domain/service/technical-rating.service';
import { AverageDailyRangeService } from './domain/service/average-daily-range.service';
import { TechnicalIndicatorService } from './domain/service/technical-indicator.service';
import { RelativeStrengthService } from './domain/service/relative-strength.service';
import { FiftyTwoWeeksHighService } from './domain/service/fifty-two-weeks-high.service';

@Module({
  providers: [
    FundamentalRatingService,
    TechnicalRatingService,
    AverageDailyRangeService,
    RelativeStrengthService,
    TechnicalIndicatorService,
    FiftyTwoWeeksHighService,
  ],
  imports: [HistoricalDataModule],
  exports: [
    FundamentalRatingService,
    TechnicalIndicatorService,
    TechnicalRatingService,
    AverageDailyRangeService,
    RelativeStrengthService,
    FiftyTwoWeeksHighService,
  ],
})
export class RatingModule {}
