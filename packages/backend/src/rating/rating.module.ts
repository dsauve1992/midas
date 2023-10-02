import { Module } from '@nestjs/common';
import { RatingProcessorRunnerService } from './rating-processor-runner.service';
import { FinancialModelingPrepModule } from '../financial-modeling-prep/financial-modeling-prep.module';
import { ScreenerModule } from '../screener/screener.module';
import { RatingController } from './rating.controller';

@Module({
  providers: [RatingProcessorRunnerService],
  imports: [FinancialModelingPrepModule, ScreenerModule],
  controllers: [RatingController],
})
export class RatingModule {}
