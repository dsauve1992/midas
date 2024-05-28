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
    const dailyAnalysis = await this.createAnalysis(symbol, '1day', 100);
    const fifteenMinuteAnalysis = await this.createAnalysis(
      symbol,
      '15min',
      30,
    );

    const dailyPercentagePriceDelta = dailyAnalysis.getPercentagePriceDelta();

    if (dailyPercentagePriceDelta > 0) {
      /// 15
      const fifteenMinuteVolumeRatio =
        fifteenMinuteAnalysis.getCurrentVsAverageVolumeRatio(20);
      const last15MinutesMACDHistogramRecordIsPositive =
        fifteenMinuteAnalysis.isLastMACDHistogramRecordIsPositive();
      const fifteenMinuteEmaAnd20EmaRising =
        fifteenMinuteAnalysis.is10EmaAnd20EmaRising();
      const fifteenMinutesPriceDeltaVsAtrRatio =
        fifteenMinuteAnalysis.getPriceDeltaVsAtrRatio(20);

      //// Daily
      const dailyVolumeRatio = dailyAnalysis.getCurrentVsAverageVolumeRatio(20);
      const lastDailyMACDHistogramRecordIsPositive =
        dailyAnalysis.isLastMACDHistogramRecordIsPositive();
      const dailyEmaAnd20EmaRising = dailyAnalysis.is10EmaAnd20EmaRising();
      const dailyPriceDeltaVsAtrRatio =
        dailyAnalysis.getPriceDeltaVsAtrRatio(20);

      if (
        (fifteenMinuteVolumeRatio >= 2 &&
          fifteenMinuteEmaAnd20EmaRising &&
          last15MinutesMACDHistogramRecordIsPositive) ||
        (dailyVolumeRatio >= 2 &&
          lastDailyMACDHistogramRecordIsPositive &&
          dailyEmaAnd20EmaRising)
      ) {
        this.eventEmitter.emit(
          StockBreakoutEvent.TYPE,
          new StockBreakoutEvent(symbol, [
            { name: '##### TimeFrame', value: '15 min' },
            { name: 'Volume Ratio', value: fifteenMinuteVolumeRatio },
            { name: 'ATR Ratio', value: fifteenMinutesPriceDeltaVsAtrRatio },
            { name: '##### TimeFrame', value: 'Daily' },
            { name: 'Volume Ratio', value: dailyVolumeRatio },
            {
              name: 'ATR Ratio',
              value: dailyPriceDeltaVsAtrRatio,
            },
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
