import { Controller, Get } from '@nestjs/common';
import { TradingViewScreenerService } from '../service/trading-view-screener.service';

@Controller('screener')
export class ScreenerController {
  constructor(private screenerFetcherService: TradingViewScreenerService) {}

  @Get('/')
  async getScreener() {
    return this.screenerFetcherService.getHierarchy();
  }
}
