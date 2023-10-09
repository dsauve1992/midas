import { Quarter } from '../../rating/domain/Quarter';

export class MissingIncomeStatement {
  constructor(private quarter: Quarter) {}

  toString(): string {
    return `${this.quarter} : Missing Data`;
  }
}
