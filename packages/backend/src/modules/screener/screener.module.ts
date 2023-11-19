import { Module } from '@nestjs/common';
import { ScreenerController } from './controller/screener.controller';
import { HttpModule } from '@nestjs/axios';
import { ScreenerService } from './service/screener.service';
import { ScreenerRepository } from './repository/screener.repository';
import { ComputeRatingScheduler } from './scheduler/compute-rating.scheduler';
import { RatingModule } from '../rating/rating.module';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule, RatingModule],
  providers: [ScreenerService, ScreenerRepository, ComputeRatingScheduler],
})
export class ScreenerModule {}
