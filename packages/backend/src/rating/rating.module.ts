import { Module } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from './usecase/compute-fundamental-rating.use-case';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { RatingController } from './controller/rating.controller';
import { ComputeTechnicalRatingUseCase } from './usecase/compute-technical-rating.use-case';

@Module({
  providers: [ComputeFundamentalRatingUseCase, ComputeTechnicalRatingUseCase],
  imports: [HistoricalDataModule],
  controllers: [RatingController],
  exports: [ComputeFundamentalRatingUseCase, ComputeTechnicalRatingUseCase],
})
export class RatingModule {}
