import { FinancialQuarter } from '../../rating/domain/FinancialQuarter';

export class MissingQuarterlyIncomeStatement {
  constructor(public quarter: FinancialQuarter) {}

  toString(): string {
    return `${this.quarter} : Missing Data`;
  }
}
