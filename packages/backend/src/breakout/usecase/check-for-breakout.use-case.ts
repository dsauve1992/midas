import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { subDays } from 'date-fns';
import { MACD, SMA } from 'technicalindicators';
import { DataFrame } from 'danfojs-node';
import { TimeFrame } from '../../shared-types/financial-modeling-prep';

@Injectable()
export class CheckForBreakoutUseCase {
  constructor(private fmpService: FinancialModelingPrepService) {}

  async execute(symbol: string): Promise<boolean> {
    return (
      (await this.checkOnDailyTimeFrame(symbol)) &&
      (await this.checkOnFifteenMinuteTimeFrame(symbol))
    );
  }

  private async checkOnDailyTimeFrame(symbol: string) {
    const df = await this.getHistory(symbol, '1day', 100);

    return this.isLastMACDHistogramRecordIsPositive(df);
  }

  private async checkOnFifteenMinuteTimeFrame(symbol: string) {
    const df = await this.getHistory(symbol, '15min', 30);

    return (
      this.isCurrentVolumeIsAtLeastFiveTimeHigherThanAverage(df) &&
      this.isLastMACDHistogramRecordIsPositive(df)
    );
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

  private isCurrentVolumeIsAtLeastFiveTimeHigherThanAverage(df: DataFrame) {
    const volumeSMA = SMA.calculate({
      period: df.shape[0],
      values: df['volume'].values,
    });
    const averageVolume = volumeSMA[0];

    const currentVolume = df['volume'].tail(1).values[0];
    return currentVolume >= 5 * averageVolume;
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
