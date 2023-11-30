import { StockBreakoutEvent } from '../event/stock-breakout.event';
import { TimeFrame } from '../../../../shared-types/financial-modeling-prep';
import { subDays } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { BreakoutStrategy } from './BreakoutStrategy';
import { TechnicalAnalysis } from '../TechnicalAnalysis';

@Injectable()
export class FifteenMinutesTimeFrameBreakoutStrategy
  implements BreakoutStrategy
{
  constructor(private fmpService: FinancialModelingPrepService) {}

  async checkFor(symbol: string): Promise<StockBreakoutEvent | null> {
    const analysis = await this.createAnalysis(symbol, '15min', 30);

    const volumeRatio = analysis.getCurrentVsAverageVolumeRatio(20);

    if (volumeRatio >= 2 && analysis.isLastMACDHistogramRecordIsPositive()) {
      return new StockBreakoutEvent(symbol, [
        { name: 'TimeFrame', value: '15 min' },
        { name: 'Volume Ratio', value: volumeRatio },
        { name: 'MACD', value: 'Positive Histogram' },
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
