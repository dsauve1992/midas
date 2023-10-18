import { Module } from '@nestjs/common';
import { RatingService } from './usecase/rating.service';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { RatingController } from './controller/rating.controller';

@Module({
  providers: [RatingService],
  imports: [HistoricalDataModule],
  controllers: [RatingController],
  exports: [RatingService],
})
export class RatingModule {}
