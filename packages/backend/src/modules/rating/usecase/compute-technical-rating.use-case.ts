import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { format, subWeeks } from 'date-fns';

@Injectable()
export class ComputeTechnicalRatingUseCase {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string) {
    let ratio = 0;

    const fiftyTwoWeeksAgo = format(subWeeks(new Date(), 52), 'yyyy-MM-dd');
    const sma200Parameters = {
      type: 'sma',
      period: '200',
      from: fiftyTwoWeeksAgo,
    };
    const sma150Parameters = {
      type: 'sma',
      period: '150',
      from: fiftyTwoWeeksAgo,
    };
    const sma50Parameters = {
      type: 'sma',
      period: '50',
      from: fiftyTwoWeeksAgo,
    };

    const [sma200Data, sma150Data, sma50Data] = await Promise.all([
      this.financialModelingPrepFetcherService.getDailyTechnicalIndicator(
        symbol,
        sma200Parameters,
      ),
      this.financialModelingPrepFetcherService.getDailyTechnicalIndicator(
        symbol,
        sma150Parameters,
      ),
      this.financialModelingPrepFetcherService.getDailyTechnicalIndicator(
        symbol,
        sma50Parameters,
      ),
    ]);

    const fiftyTwoWeeksHigh = Math.max(...sma50Data.map(({ high }) => high));
    const fiftyTwoWeeksLow = Math.min(...sma50Data.map(({ low }) => low));
    const currentPrice = sma50Data[0].close;

    const highRatio = (1 - currentPrice / fiftyTwoWeeksHigh) * 100;
    const lowRatio = (currentPrice / fiftyTwoWeeksLow - 1) * 100;

    const currentSma200 = sma200Data[0].sma!;
    const currentSma150 = sma150Data[0].sma!;
    const currentSma50 = sma50Data[0].sma!;

    if (currentSma150 > currentSma200) {
      ratio += 30;
    }

    if (currentSma50 > currentSma150) {
      ratio += 30;
    }

    if (currentPrice > currentSma50) {
      ratio += 20;
    }

    if (highRatio < 25) {
      ratio += 10;
    }

    if (lowRatio > 30) {
      ratio += 10;
    }

    return ratio;
  }
}
