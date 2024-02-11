import { FinancialPeriod } from './FinancialPeriod';

export class FinancialQuarter implements FinancialPeriod<FinancialQuarter> {
  constructor(
    public readonly quarterNumber: number,
    public readonly year: number,
  ) {}

  isEqual(quarter: FinancialQuarter): boolean {
    return this.valueOf() === quarter.valueOf();
  }

  toString(): string {
    return `Q${this.quarterNumber} - ${this.year}`;
  }

  valueOf(): number {
    return this.year + this.quarterNumber / 10;
  }

  previous(): FinancialQuarter {
    if (this.quarterNumber === 1) {
      return new FinancialQuarter(4, this.year - 1);
    }

    return new FinancialQuarter(this.quarterNumber - 1, this.year);
  }

  next(): FinancialQuarter {
    if (this.quarterNumber === 4) {
      return new FinancialQuarter(1, this.year + 1);
    }

    return new FinancialQuarter(this.quarterNumber + 1, this.year);
  }

  sameQuarterOneYearBefore(): FinancialQuarter {
    return new FinancialQuarter(this.quarterNumber, this.year - 1);
  }

  compare(quarter: FinancialQuarter): -1 | 0 | 1 {
    if (this.valueOf() < quarter.valueOf()) {
      return -1;
    } else if (this.valueOf() > quarter.valueOf()) {
      return 1;
    }

    return 0;
  }
}
