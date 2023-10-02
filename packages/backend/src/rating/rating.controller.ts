import { Controller, Get } from '@nestjs/common';
import { RatingProcessorRunnerService } from './rating-processor-runner.service';
import { FinancialModelingPrepFetcherClient } from '../financial-modeling-prep/financial-modeling-prep-fetcher-client.service';

@Controller('/rating')
export class RatingController {
  constructor(
    private ratingProcessorRunnerService: RatingProcessorRunnerService,
    private financialModelingPrepFetcherService: FinancialModelingPrepFetcherClient,
  ) {}

  @Get()
  async get() {
    return this.ratingProcessorRunnerService.computeRatingFor('BSX');
  }
}
