import { Injectable, Logger } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import {
  AnnuallyIncomeHistory,
  QuarterlyIncomeHistory,
} from '../domain/QuarterlyIncomeHistory';
import { Sorting } from '../domain/Sorting';
import { Quarter } from '../domain/Quarter';
import {
  AnnuallyIncomeSummary,
  FundamentalSummary,
  QuarterlyIncomeSummary,
} from '../domain/FundamentalSummary';
import { format, subWeeks } from 'date-fns';

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);

  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async getFundamentalRatingFor(symbol: string) {
    let rating = 0;

    const summary = await this.getFundamentalSummary(symbol);

    const [lastQuarter, quarterMinusOne, quarterMinusTwo, quarterMinusThree] =
      summary.quarterlyIncomeSummary.model;

    const [lastYear, lastYearMinusOne, lastYearMinusTwo] =
      summary.annuallyIncomeSummary.model;

    if (lastQuarter.eps.getPercentage() > 25) {
      rating += 40;
    }

    if (lastQuarter.sales.getPercentage() > 25) {
      rating += 20;
    }

    if (
      [quarterMinusOne, quarterMinusTwo, quarterMinusThree].every(
        ({ eps }) => eps.getPercentage() > 25,
      )
    ) {
      rating += 15;
    }

    if (
      [lastYear, lastYearMinusOne, lastYearMinusTwo].every(
        ({ growth }) => growth.getPercentage() > 25,
      )
    ) {
      rating += 15;
    }

    if (summary.returnOnEquity > 0.17) {
      rating += 10;
    }

    return rating;
  }

  async getTechnicalRatingFor(symbol: string) {
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

  private async getFundamentalSummary(symbol: string) {
    const [
      quarterlyIncomeStatementHistory,
      annuallyIncomeStatementHistory,
      [currentYearRatios],
    ] = await Promise.all([
      this.getQuarterlyIncomeStatementHistory(symbol),
      this.getAnnuallyIncomeStatementHistory(symbol),
      this.financialModelingPrepFetcherService.getEnterpriseRatios(symbol, {
        limit: 1,
      }),
    ]);

    const quarterlyData = quarterlyIncomeStatementHistory.getLastNQuarter(
      4,
      Sorting.DESC,
    );

    const annuallyData = annuallyIncomeStatementHistory.getLastNYear(
      5,
      Sorting.DESC,
    );

    const returnOnEquity = currentYearRatios.returnOnEquity;

    return new FundamentalSummary(
      new QuarterlyIncomeSummary(quarterlyData),
      new AnnuallyIncomeSummary(annuallyData),
      returnOnEquity,
    );
  }

  private async getQuarterlyIncomeStatementHistory(symbol: string) {
    const statementHistory =
      await this.financialModelingPrepFetcherService.getIncomeStatements(
        symbol,
        { period: 'quarter', limit: '8' },
      );

    return new QuarterlyIncomeHistory(
      statementHistory.map(({ calendarYear, period, epsdiluted, revenue }) => ({
        quarter: new Quarter(
          parseInt(period.slice(1, 2)),
          parseInt(calendarYear),
        ),
        eps: epsdiluted,
        sales: revenue,
      })),
    );
  }

  private async getAnnuallyIncomeStatementHistory(symbol: string) {
    const statementHistory =
      await this.financialModelingPrepFetcherService.getIncomeStatements(
        symbol,
        { limit: '8' },
      );

    return new AnnuallyIncomeHistory(
      statementHistory.map(({ calendarYear, epsdiluted, revenue }) => ({
        year: parseInt(calendarYear),
        eps: epsdiluted,
        sales: revenue,
      })),
    );
  }
}
