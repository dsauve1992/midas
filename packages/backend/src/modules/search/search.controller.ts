import { Controller, Get, Query } from '@nestjs/common';
import { FinancialModelingPrepService } from '../historical-data/financial-modeling-prep.service';

@Controller('search')
export class SearchController {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  @Get('/')
  async search(@Query('query') query: string) {
    return this.financialModelingPrepService.search(query);
  }
}
