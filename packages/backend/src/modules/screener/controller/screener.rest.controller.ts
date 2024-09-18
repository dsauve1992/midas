import { Controller, Get, Param } from '@nestjs/common';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';
import { StockAnalyser } from '../domain/stock-analyser';
import { SymbolWithExchange } from '../../stocks/domain/symbol-with-exchange';

@Controller('screener')
export class ScreenerRestController {
  constructor(
    private tradingViewScreenerService: TradingViewScreenerService,
    private stockAnalyser: StockAnalyser,
  ) {}

  @Get()
  async getScreener(): Promise<NewScreenerEntryFrontendDto[]> {
    return this.tradingViewScreenerService.search();
  }

  @Get('/:symbol')
  async test(@Param('symbol') symbol: string): Promise<void> {
    const result = await this.stockAnalyser.for(
      SymbolWithExchange.from(symbol),
    );

    console.log('**********');
    console.log(result);
    console.log('**********');
  }
}
