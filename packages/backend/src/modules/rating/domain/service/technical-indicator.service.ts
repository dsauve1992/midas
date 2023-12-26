import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { subWeeks } from 'date-fns';
import { TechnicalAnalysis } from '../../../breakout/domain/TechnicalAnalysis';

@Injectable()
export class TechnicalIndicatorService {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async getTechnicalIndicators(symbol: string) {
    const fiftyTwoWeeksAgo = subWeeks(new Date(), 52);

    const history =
      await this.financialModelingPrepFetcherService.getHistoricalChart(
        symbol,
        '1day',
        {
          from: fiftyTwoWeeksAgo,
        },
      );

    const technicalAnalysis = new TechnicalAnalysis(history);

    const currentEma10 = technicalAnalysis.getEmaLastValue(10);
    const currentEma20 = technicalAnalysis.getEmaLastValue(20);
    const currentSma50 = technicalAnalysis.getSmaLastValue(50);
    const currentSma150 = technicalAnalysis.getSmaLastValue(150);
    const currentSma200 = technicalAnalysis.getSmaLastValue(200);
    const currentPrice = technicalAnalysis.getCurrentPrice();
    const fiftyTwoWeeksHigh = technicalAnalysis.getFiftyTwoWeeksHigh();
    const fiftyTwoWeeksLow = technicalAnalysis.getFiftyTwoWeeksLow();

    const highRatio = (1 - currentPrice / fiftyTwoWeeksHigh) * 100;
    const lowRatio = (currentPrice / fiftyTwoWeeksLow - 1) * 100;
    return {
      currentSma200,
      currentSma150,
      currentSma50,
      currentEma20,
      currentEma10,
      currentPrice,
      highRatio: +highRatio.toFixed(2),
      lowRatio: +lowRatio.toFixed(2),
    };
  }
}
