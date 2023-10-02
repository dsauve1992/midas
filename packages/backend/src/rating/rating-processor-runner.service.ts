import { Injectable, Logger } from '@nestjs/common';
import { FinancialModelingPrepFetcherClient } from '../financial-modeling-prep/financial-modeling-prep-fetcher-client.service';
import {
  AnnuallyIncomeHistory,
  QuarterlyIncomeHistory,
} from './domain/QuarterlyIncomeHistory';
import { Sorting } from './domain/Sorting';
import { Quarter } from './domain/Quarter';
import {
  AnnuallyIncomeSummary,
  FundamentalSummary,
  QuarterlyIncomeSummary,
} from './domain/FundamentalSummary';

@Injectable()
export class RatingProcessorRunnerService {
  private readonly logger = new Logger(RatingProcessorRunnerService.name);

  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepFetcherClient,
  ) {}

  async computeRatingFor(symbol: string) {
    const quarterlyIncomeStatementHistory =
      await this.getQuarterlyIncomeStatementHistory(symbol);

    const quarterlyData = quarterlyIncomeStatementHistory.getLastNQuarter(
      4,
      Sorting.DESC,
    );

    const annuallyIncomeStatementHistory =
      await this.getAnnuallyIncomeStatementHistory(symbol);

    const annuallyData = annuallyIncomeStatementHistory.getLastNYear(
      5,
      Sorting.DESC,
    );

    const [currentYearRatios] =
      await this.financialModelingPrepFetcherService.getEnterpriseRatios(
        symbol,
        { limit: 1 },
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
