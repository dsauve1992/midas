import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialModelingPrepFetcherClient } from './financial-modeling-prep-fetcher-client.service';

@Controller('api/fmp')
export class HistoricalDataController {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepFetcherClient,
  ) {}

  @Get('*')
  async proxy(@Param() params, @Query() query) {
    return this.financialModelingPrepFetcherService.fetch(params[0], query);
  }
}
