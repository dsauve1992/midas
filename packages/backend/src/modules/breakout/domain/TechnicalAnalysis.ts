import { OHLCVRecord } from '../../../shared-types/financial-modeling-prep';
import { DataFrame } from 'danfojs-node';
import { EMA, MACD } from 'technicalindicators';

export class TechnicalAnalysis {
  private dataframe: DataFrame;
  constructor(history: OHLCVRecord[]) {
    this.dataframe = new DataFrame(history.reverse());
  }

  isLastMACDHistogramRecordIsPositive() {
    const macdHistory = new DataFrame(
      MACD.calculate({
        values: this.dataframe['close'].values,
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

  getCurrentVsAverageVolumeRatio(period: number) {
    const EMA_volume = EMA.calculate({
      values: this.dataframe['volume'].values,
      period,
    });
    const averageVolume = EMA_volume[EMA_volume.length - 1];

    const currentVolume = this.dataframe['volume'].tail(1).values[0];
    return currentVolume / averageVolume;
  }

  isPriceRising(): boolean {
    const priceHistory = this.dataframe['close'].values;
    return (
      priceHistory[priceHistory.length - 1] >
      priceHistory[priceHistory.length - 2]
    );
  }

  is10EmaAnd20EmaRising() {
    const EMA10_close = EMA.calculate({
      values: this.dataframe['close'].values,
      period: 10,
    });

    const EMA20_close = EMA.calculate({
      values: this.dataframe['close'].values,
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
