import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockBreakoutEvent } from './event/stock-breakout.event';
import { TimeFrame } from '../../../shared-types/financial-modeling-prep';
import { subDays } from 'date-fns';
import { TechnicalAnalysis } from './TechnicalAnalysis';

@Injectable()
export class BreakoutService {
  constructor(
    private fmpService: FinancialModelingPrepService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkFor(symbol: string): Promise<void> {
    const fifteenMinuteAnalysis = await this.createAnalysis(
      symbol,
      '15min',
      30,
    );

    const dailyAnalysis = await this.createAnalysis(symbol, '1day', 100);

    if (dailyAnalysis.isPriceRising()) {
      const fifteenMinuteVolumeRatio =
        fifteenMinuteAnalysis.getCurrentVsAverageVolumeRatio(20);
      if (
        fifteenMinuteVolumeRatio >= 2 &&
        fifteenMinuteAnalysis.isLastMACDHistogramRecordIsPositive()
      ) {
        this.eventEmitter.emit(
          StockBreakoutEvent.TYPE,
          new StockBreakoutEvent(symbol, [
            { name: 'TimeFrame', value: '15 min' },
            { name: 'Volume Ratio', value: fifteenMinuteVolumeRatio },
            { name: 'MACD', value: 'Positive Histogram' },
          ]),
        );
      }

      const dailyVolumeRatio = dailyAnalysis.getCurrentVsAverageVolumeRatio(20);

      if (
        dailyVolumeRatio >= 2 &&
        dailyAnalysis.isLastMACDHistogramRecordIsPositive() &&
        dailyAnalysis.is10EmaAnd20EmaRising()
      ) {
        this.eventEmitter.emit(
          StockBreakoutEvent.TYPE,
          new StockBreakoutEvent(symbol, [
            { name: 'TimeFrame', value: 'Daily' },
            { name: 'Volume Ratio', value: dailyVolumeRatio },
            { name: 'MACD', value: 'Positive Histogram' },
            { name: 'ema', value: '10 ema and 20 ema rising (10 above 20)' },
          ]),
        );
      }
    }
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
