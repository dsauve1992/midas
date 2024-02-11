import { FinancialPeriod } from './FinancialPeriod';

export class FinancialYear implements FinancialPeriod<FinancialYear> {
  constructor(public readonly year: number) {}

  isEqual(quarter: FinancialYear): boolean {
    return this.valueOf() === quarter.valueOf();
  }

  toString(): string {
    return `${this.year}`;
  }

  valueOf(): number {
    return this.year;
  }

  previous(): FinancialYear {
    return new FinancialYear(this.year - 1);
  }

  next(): FinancialYear {
    return new FinancialYear(this.year + 1);
  }

  compare(year: FinancialYear): -1 | 0 | 1 {
    if (this.valueOf() < year.valueOf()) {
      return -1;
    } else if (this.valueOf() > year.valueOf()) {
      return 1;
    }

    return 0;
  }
}
