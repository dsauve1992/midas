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

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);

  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async getRatingFor(symbol: string) {
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
