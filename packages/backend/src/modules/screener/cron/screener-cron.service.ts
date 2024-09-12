import { Injectable } from '@nestjs/common';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScreenerCronService {
  constructor(private tradingViewScreenerService: TradingViewScreenerService) {}

  @Cron('45 * * * * *')
  handleCron() {
    return this.tradingViewScreenerService.search();
  }
}
