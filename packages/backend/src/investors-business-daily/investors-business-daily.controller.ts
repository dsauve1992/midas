import { Controller, Get, Query } from '@nestjs/common';
import { InvestorsBusinessDailyService } from './investors-business-daily.service';

@Controller('investors-business-daily')
export class InvestorsBusinessDailyController {
  constructor(
    private investorsBusinessDailyWebScrapperService: InvestorsBusinessDailyService,
  ) {}

  @Get('/ranking')
  async getStockRankingInfo(@Query() query) {
    const { symbol } = query;

    return this.investorsBusinessDailyWebScrapperService.fetchStockRankings(
      symbol,
    );
  }
}
