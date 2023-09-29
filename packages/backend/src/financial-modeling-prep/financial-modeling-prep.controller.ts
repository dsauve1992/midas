import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialModelingPrepFetcherService } from './financial-modeling-prep-fetcher.service';

@Controller('api/fmp')
export class FinancialModelingPrepController {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepFetcherService,
  ) {}

  @Get('*')
  async proxy(@Param() params, @Query() query) {
    return this.financialModelingPrepFetcherService.fetch(params[0], query);
  }
}
