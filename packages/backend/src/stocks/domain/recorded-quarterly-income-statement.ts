import { Quarter } from '../../rating/domain/Quarter';

export interface RecordedQuarterlyIncomeStatementModel {
  quarter: Quarter;
  acceptedDate: string;

  earnings: {
    current: number;
    previous?: number;
    growth?: number;
  };
  sales: {
    current: number;
    previous?: number;
    growth?: number;
  };
  netProfitMargin?: number;
}

export class RecordedQuarterlyIncomeStatement {
  constructor(public model: RecordedQuarterlyIncomeStatementModel) {}

  toString(): string {
    return `${
      this.model.quarter
    } : ${this.stringifyEarningsData()} | ${this.stringifySalesData()} | ${this.stringifyProfitMarginData()}`;
  }

  private stringifyEarningsData(): string {
    const { current, growth } = this.model.earnings;

    return `Earnings : ${current} ${growth ? `(${growth}%)}` : ''}`;
  }

  private stringifySalesData(): string {
    const { current, growth } = this.model.sales;

    return `Sales : ${current} ${growth ? `(${growth}%)}` : ''}`;
  }

  private stringifyProfitMarginData(): string {
    return `Net Profit Margin : ${this.model.netProfitMargin}`;
  }
}
