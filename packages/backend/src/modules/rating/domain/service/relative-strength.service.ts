import { Injectable } from '@nestjs/common';
import { subWeeks } from 'date-fns';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { DataFrame } from 'danfojs-node';
import { SMA } from 'technicalindicators';

type RelativeStrengthResponse = {
  rsLine: number;
  rsLineSma50: number;
  rsLineSma200: number;
  _5WeeksHigh: number;
  _52WeeksHigh: number;
};

@Injectable()
export class RelativeStrengthService {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string): Promise<RelativeStrengthResponse> {
    const fiftyFourWeeksAgo = subWeeks(new Date(), 54);

    const indexHistory =
      await this.financialModelingPrepFetcherService.getHistoricalChart(
        'SPY',
        '1day',
        {
          from: fiftyFourWeeksAgo,
        },
      );

    const indexDf = new DataFrame(indexHistory.reverse()).setIndex({
      column: 'date',
    });

    const tickerHistory =
      await this.financialModelingPrepFetcherService.getHistoricalChart(
        symbol,
        '1day',
        {
          from: fiftyFourWeeksAgo,
        },
      );

    const tickerDf = new DataFrame(tickerHistory.reverse()).setIndex({
      column: 'date',
    });

    const rsLine = tickerDf['close'].div(indexDf['close']).mul(100);

    const _52WeeksHigh = rsLine.tail(260).max().toFixed(2);
    const _5WeeksHigh = rsLine.tail(25).max().toFixed(2);

    const rsLineSma50 = SMA.calculate({ values: rsLine.values, period: 50 });
    const rsLineSma200 = SMA.calculate({ values: rsLine.values, period: 200 });

    return {
      rsLine: rsLine.values.reverse()[0],
      rsLineSma50: rsLineSma50.reverse()[0],
      rsLineSma200: rsLineSma200.reverse()[0],
      _52WeeksHigh,
      _5WeeksHigh,
    };
  }
}
