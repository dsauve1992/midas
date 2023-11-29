import { StockBreakoutEvent } from '../event/stock-breakout.event';
import { DataFrame } from 'danfojs-node';
import { EMA, MACD } from 'technicalindicators';
import { TimeFrame } from '../../../../shared-types/financial-modeling-prep';
import { subDays } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { BreakoutStrategy } from './BreakoutStrategy';

@Injectable()
export class FifteenMinutesTimeFrameBreakoutStrategy
  implements BreakoutStrategy
{
  constructor(private fmpService: FinancialModelingPrepService) {}

  async checkFor(symbol: string): Promise<StockBreakoutEvent | null> {
    const df = await this.getHistory(symbol, '15min', 30);

    const volumeRatio = this.getCurrentVsAverageVolumeRatio(df);

    if (volumeRatio >= 2 && this.isLastMACDHistogramRecordIsPositive(df)) {
      return new StockBreakoutEvent(symbol); // TODO add ratio
    }
    return null;
  }

  private isLastMACDHistogramRecordIsPositive(df: DataFrame) {
    const macdHistory = new DataFrame(
      MACD.calculate({
        values: df['close'].values,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      }),
    );

    const lastHistogramValue = macdHistory.tail(1)['histogram'].values[0];
    return lastHistogramValue > 0;
  }

  private getCurrentVsAverageVolumeRatio(df: DataFrame) {
    const EMA20_volume = EMA.calculate({
      values: df['volume'].values,
      period: 20,
    });
    const averageVolume = EMA20_volume[EMA20_volume.length - 1];

    const currentVolume = df['volume'].tail(1).values[0];
    return currentVolume / averageVolume;
  }

  private async getHistory(
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

    return new DataFrame(history.reverse());
  }
}
