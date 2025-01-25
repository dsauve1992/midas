import { OHLCVRecord } from '../../../shared-types/financial-modeling-prep';
import { DataFrame } from 'danfojs-node';
import { ATR, EMA, MACD, SMA } from 'technicalindicators';

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

  getPriceDeltaVsAtrRatio(period: number): number {
    const previousAtr = this.getPreviousAtr(period);
    const priceDelta = this.getPriceDelta();

    return priceDelta / previousAtr;
  }

  private getPreviousAtr(period: number) {
    const averageTrueRange = ATR.calculate({
      close: this.dataframe['close'].values,
      low: this.dataframe['low'].values,
      high: this.dataframe['high'].values,
      period,
    });

    return averageTrueRange[averageTrueRange.length - 2];
  }

  getPercentagePriceDelta(): number {
    const priceHistory = this.dataframe['close'].values;
    return (
      (priceHistory[priceHistory.length - 1] /
        priceHistory[priceHistory.length - 2] -
        1) *
      100
    );
  }

  getPriceDelta(): number {
    const priceHistory = this.dataframe['close'].values;
    return (
      priceHistory[priceHistory.length - 1] -
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

  getEma(period: number): number[] {
    return EMA.calculate({
      values: this.dataframe['close'].values,
      period: period,
    });
  }

  getSma(period: number): number[] {
    return SMA.calculate({
      values: this.dataframe['close'].values,
      period: period,
    });
  }

  getCurrentPrice() {
    return this.dataframe.tail(1)['close'].values[0];
  }

  getFiftyTwoWeeksHigh() {
    return this.dataframe.tail(260)['high'].max().toFixed(2);
  }

  getFiftyTwoWeeksLow() {
    return +this.dataframe.tail(260)['low'].min().toFixed(2);
  }
}
