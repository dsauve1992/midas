import { Quarter } from './Quarter';
import { Sorting } from './Sorting';
import { Growth } from './Growth';

export type QuarterlyIncomeHistoryModel = {
  quarter: Quarter;
  sales: number;
  eps: number;
}[];

export class QuarterlyIncomeHistory {
  constructor(private history: QuarterlyIncomeHistoryModel) {}

  getLastNQuarter(
    n: number,
    sort: Sorting,
  ): { quarter: Quarter; eps: Growth; sales: Growth }[] {
    return this.history
      .map(({ quarter }) => quarter)
      .sort((a, b) => a.compare(b) * Sorting.DESC)
      .slice(0, n)
      .sort((a, b) => a.compare(b) * sort)
      .map((quarter) => ({
        quarter,
        eps: this.getEpsGrowthForQuarter(quarter),
        sales: this.getSalesGrowthForQuarter(quarter),
      }));
  }

  private getEpsGrowthForQuarter(currentQuarter: Quarter) {
    const { incomeDataForCurrentQuarter, incomeDataForPreviousQuarter } =
      this.getIncomeDataForQuarterPair(currentQuarter);

    return new Growth(
      incomeDataForCurrentQuarter.eps,
      incomeDataForPreviousQuarter.eps,
    );
  }

  private getSalesGrowthForQuarter(currentQuarter: Quarter) {
    const { incomeDataForCurrentQuarter, incomeDataForPreviousQuarter } =
      this.getIncomeDataForQuarterPair(currentQuarter);

    return new Growth(
      incomeDataForCurrentQuarter.sales,
      incomeDataForPreviousQuarter.sales,
    );
  }

  private getIncomeDataForQuarterPair(currentQuarter: Quarter) {
    const oneYearAgo = currentQuarter.sameQuarterOneYearBefore();
    const incomeDataForCurrentQuarter = this.getDataFor(currentQuarter);
    const incomeDataForPreviousQuarter = this.getDataFor(oneYearAgo);
    return { incomeDataForCurrentQuarter, incomeDataForPreviousQuarter };
  }

  private getDataFor(_quarter: Quarter) {
    const incomeData = this.history.find(({ quarter }) =>
      quarter.isEqual(_quarter),
    );

    if (!incomeData) {
      throw new Error(`Cannot find data for ${_quarter}`);
    }

    return incomeData;
  }
}

export type AnnuallyIncomeHistoryModel = {
  year: number;
  sales: number;
  eps: number;
}[];
export class AnnuallyIncomeHistory {
  constructor(private history: AnnuallyIncomeHistoryModel) {}

  getLastNYear(n: number, sort: Sorting): { year: number; growth: Growth }[] {
    return this.history
      .map(({ year }) => year)
      .sort((a, b) => (a - b) * Sorting.DESC)
      .slice(0, n)
      .sort((a, b) => (a - b) * sort)
      .map((year) => ({ year, growth: this.getEpsGrowthForYear(year) }));
  }

  getEpsGrowthForYear(year: number): Growth {
    const { incomeDataForCurrentYear, incomeDataForPreviousYear } =
      this.getIncomeDataForYearPair(year);

    return new Growth(
      incomeDataForCurrentYear.eps,
      incomeDataForPreviousYear.eps,
    );
  }

  private getIncomeDataForYearPair(year: number) {
    const oneYearAgo = year - 1;
    const incomeDataForCurrentYear = this.getDataFor(year);
    const incomeDataForPreviousYear = this.getDataFor(oneYearAgo);
    return { incomeDataForCurrentYear, incomeDataForPreviousYear };
  }

  private getDataFor(_year: number) {
    const incomeData = this.history.find(({ year }) => year == _year);

    if (!incomeData) {
      throw new Error(`Cannot find data for ${_year}`);
    }

    return incomeData;
  }
}
