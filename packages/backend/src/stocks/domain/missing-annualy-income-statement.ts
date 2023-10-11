export class MissingAnnuallyIncomeStatement {
  constructor(public year: number) {}

  toString(): string {
    return `FY - ${this.year} : Missing Data`;
  }
}
