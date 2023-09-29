import { Module } from '@nestjs/common';
import { RatingProcessorRunnerService } from './rating-processor-runner.service';
import { FinancialModelingPrepModule } from '../financial-modeling-prep/financial-modeling-prep.module';
import { ScreenerModule } from '../screener/screener.module';

@Module({
  providers: [RatingProcessorRunnerService],
  imports: [FinancialModelingPrepModule, ScreenerModule],
})
export class RatingModule {}
