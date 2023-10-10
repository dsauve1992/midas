import { Quarter } from '../../rating/domain/Quarter';

export class MissingIncomeStatement {
  constructor(public quarter: Quarter) {}

  toString(): string {
    return `${this.quarter} : Missing Data`;
  }
}
