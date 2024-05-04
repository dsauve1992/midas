import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import {
  AnnuallyIncomeHistory,
  QuarterlyIncomeHistory,
} from '../QuarterlyIncomeHistory';
import { Sorting } from '../Sorting';
import { FinancialQuarter } from '../FinancialQuarter';
import {
  AnnuallyIncomeSummary,
  FundamentalSummary,
  QuarterlyIncomeSummary,
} from '../FundamentalSummary';
import { meanBy } from 'lodash';

@Injectable()
export class FundamentalRatingService {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string) {
    try {
      let rating = 0;

      const summary = await this.getFundamentalSummary(symbol);

      const [lastQuarter, quarterMinusOne, quarterMinusTwo, quarterMinusThree] =
        summary.quarterlyIncomeSummary.model;

      const [lastYear, lastYearMinusOne, lastYearMinusTwo] =
        summary.annuallyIncomeSummary.model;

      if (lastQuarter.eps.getPercentage() > 25) {
        rating += 40;
      }

      const isLastSalesGrowthUpperThan25 =
        lastQuarter.sales.getPercentage() > 25;
      const isLastSalesGrowthUpperThanThreePreviousSalesGrowthMean =
        lastQuarter.sales.getPercentage() >
        meanBy([quarterMinusOne, quarterMinusTwo, quarterMinusThree], (el) =>
          el.sales.getPercentage(),
        );

      if (
        isLastSalesGrowthUpperThan25 ||
        isLastSalesGrowthUpperThanThreePreviousSalesGrowthMean
      ) {
        rating += 20;
      }

      if (
        [quarterMinusOne, quarterMinusTwo, quarterMinusThree].every(
          ({ eps }) => eps.getPercentage() > 25,
        )
      ) {
        rating += 20;
      }

      if (
        [lastYear, lastYearMinusOne, lastYearMinusTwo].every(
          ({ growth }) => growth.getPercentage() > 25,
        )
      ) {
        rating += 15;
      }

      if (summary.returnOnEquity > 0.17) {
        rating += 5;
      }

      return rating;
    } catch (error) {
      return -1;
    }
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
        quarter: new FinancialQuarter(
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
