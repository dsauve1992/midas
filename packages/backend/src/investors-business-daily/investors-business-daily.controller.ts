import { Controller, Get, Query } from '@nestjs/common';
import { InvestorsBusinessDailyWebScrapperService } from './investors-business-daily-web-scrapper.service';

@Controller('investors-business-daily')
export class InvestorsBusinessDailyController {
  constructor(
    private investorsBusinessDailyWebScrapperService: InvestorsBusinessDailyWebScrapperService,
  ) {}

  @Get('/ranking')
  async getStockRankingInfo(@Query() query) {
    const { symbol } = query;

    return this.investorsBusinessDailyWebScrapperService.fetchStockRankings(
      symbol,
    );
  }
}
