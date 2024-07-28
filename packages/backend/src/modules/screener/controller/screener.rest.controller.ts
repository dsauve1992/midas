import { Controller, Get } from '@nestjs/common';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';

@Controller('screener')
export class ScreenerRestController {
  constructor(private tradingViewScreenerService: TradingViewScreenerService) {}

  @Get()
  async getScreener(): Promise<NewScreenerEntryFrontendDto[]> {
    return this.tradingViewScreenerService.search();
  }
}
