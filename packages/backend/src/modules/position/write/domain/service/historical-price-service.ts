import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../../historical-data/financial-modeling-prep.service';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';

@Injectable()
export class HistoricalPriceService {
  constructor(
    private readonly financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async getLast15MinPriceRangeFor(
    symbol: SymbolWithExchange,
  ): Promise<{ high: number; low: number }> {
    const history = await this.financialModelingPrepService.getHistoricalChart(
      symbol.symbol,
      '15min',
      { from: new Date() },
    );

    if (!history || !history.length) {
      throw new Error('No historical data found');
    }

    return history[0];
  }
}
