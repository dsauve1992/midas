import { Quarter } from './Quarter';
import { Growth } from './Growth';

export type QuarterlyIncomeSummaryModel = {
  quarter: Quarter;
  eps: Growth;
  sales: Growth;
}[];

export type AnnuallyIncomeSummaryModel = {
  year: number;
  growth: Growth;
}[];

export class QuarterlyIncomeSummary {
  constructor(public model: QuarterlyIncomeSummaryModel) {}

  toString(): string {
    return this.model
      .map(
        ({ quarter, eps, sales }) =>
          `${quarter.toString()} | eps: ${eps.toString()} | sales: ${sales.toString()}`,
      )
      .join('\n');
  }
}

export class AnnuallyIncomeSummary {
  constructor(public model: AnnuallyIncomeSummaryModel) {}

  toString(): string {
    return this.model
      .map(({ year, growth }) => `${year} | eps: ${growth.toString()}`)
      .join('\n');
  }
}

export class FundamentalSummary {
  constructor(
    public quarterlyIncomeSummary: QuarterlyIncomeSummary,
    public annuallyIncomeSummary: AnnuallyIncomeSummary,
    public returnOnEquity: number,
  ) {}
}
