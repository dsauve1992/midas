import { StockBreakoutEvent } from '../event/stock-breakout.event';
import { TimeFrame } from '../../../../shared-types/financial-modeling-prep';
import { subDays } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { BreakoutStrategy } from './BreakoutStrategy';
import { TechnicalAnalysis } from '../TechnicalAnalysis';

@Injectable()
export class DailyTimeFrameBreakoutStrategy implements BreakoutStrategy {
  constructor(private fmpService: FinancialModelingPrepService) {}

  async checkFor(symbol: string): Promise<StockBreakoutEvent | null> {
    const analysis = await this.createAnalysis(symbol, '1day', 100);

    const volumeRatio = analysis.getCurrentVsAverageVolumeRatio(20);

    if (
      volumeRatio >= 2 &&
      analysis.isLastMACDHistogramRecordIsPositive() &&
      analysis.is10EmaAnd20EmaRising()
    ) {
      return new StockBreakoutEvent(symbol, [
        { name: 'TimeFrame', value: 'Daily' },
        { name: 'Volume Ratio', value: volumeRatio },
        { name: 'MACD', value: 'Positive Histogram' },
        { name: 'ema', value: '10 ema and 20 ema rising (10 above 20)' },
      ]);
    }

    return null;
  }

  private async createAnalysis(
    symbol: string,
    timeFrame: TimeFrame,
    lastNDays: number,
  ) {
    const nDaysAgo = subDays(new Date(), lastNDays);

    const history = await this.fmpService.getHistoricalChart(
      symbol,
      timeFrame,
      {
        from: nDaysAgo,
      },
    );

    return new TechnicalAnalysis(history);
  }
}
