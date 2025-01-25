import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { subWeeks } from 'date-fns';
import { TechnicalAnalysis } from '../TechnicalAnalysis';

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

    const currentEma10 = +technicalAnalysis.getEma(10).reverse()[0].toFixed(2);
    const currentEma20 = +technicalAnalysis.getEma(20).reverse()[0].toFixed(2);
    const currentSma50 = +technicalAnalysis.getSma(50).reverse()[0].toFixed(2);
    const currentSma150 = +technicalAnalysis
      .getSma(150)
      .reverse()[0]
      .toFixed(2);
    const currentSma200 = +technicalAnalysis
      .getSma(200)
      .reverse()[0]
      .toFixed(2);
    const currentPrice = technicalAnalysis.getCurrentPrice();
    const fiftyTwoWeeksHigh = technicalAnalysis.getFiftyTwoWeeksHigh();
    const fiftyTwoWeeksLow = technicalAnalysis.getFiftyTwoWeeksLow();

    const highRatio = (1 - currentPrice / fiftyTwoWeeksHigh) * 100;
    const lowRatio = (currentPrice / fiftyTwoWeeksLow - 1) * 100;

    const sma200ReverseHistory = technicalAnalysis.getSma(200).reverse();
    const sma200LastMonthPerformance =
      (sma200ReverseHistory[0] / sma200ReverseHistory[20] - 1) * 100;

    return {
      currentSma200,
      sma200LastMonthPerformance: +sma200LastMonthPerformance.toFixed(2),
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
