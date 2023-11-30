import { StockBreakoutEvent } from '../event/stock-breakout.event';
import { DataFrame } from 'danfojs-node';
import { EMA, MACD } from 'technicalindicators';
import { TimeFrame } from '../../../../shared-types/financial-modeling-prep';
import { subDays } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { BreakoutStrategy } from './BreakoutStrategy';

@Injectable()
export class DailyTimeFrameBreakoutStrategy implements BreakoutStrategy {
  constructor(private fmpService: FinancialModelingPrepService) {}

  async checkFor(symbol: string): Promise<StockBreakoutEvent | null> {
    const df = await this.getHistory(symbol, '1day', 100);

    const volumeRatio = this.getCurrentVsAverageVolumeRatio(df);

    if (
      volumeRatio >= 2 &&
      this.isLastMACDHistogramRecordIsPositive(df) &&
      this.is10EmaAnd20EmaRising(df)
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

  private is10EmaAnd20EmaRising(df: DataFrame) {
    const EMA10_close = EMA.calculate({
      values: df['close'].values,
      period: 10,
    });

    const EMA20_close = EMA.calculate({
      values: df['close'].values,
      period: 20,
    });

    const ema10Rising =
      EMA10_close[EMA10_close.length - 1] > EMA10_close[EMA10_close.length - 2];
    const ema20Rising =
      EMA20_close[EMA20_close.length - 1] > EMA20_close[EMA20_close.length - 2];
    const ema10AboveEma20 =
      EMA10_close[EMA10_close.length - 1] > EMA20_close[EMA20_close.length - 1];

    return ema10Rising && ema20Rising && ema10AboveEma20;
  }
}
