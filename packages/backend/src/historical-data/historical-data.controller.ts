import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialModelingPrepService } from './financial-modeling-prep.service';

@Controller('api/fmp')
export class HistoricalDataController {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  @Get('*')
  async proxy(@Param() params, @Query() query) {
    return this.financialModelingPrepFetcherService.fetch(params[0], query);
  }
}
