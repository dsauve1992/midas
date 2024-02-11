export interface FinancialPeriod<T> {
  compare(other: T): -1 | 0 | 1;
  next(): FinancialPeriod<T>;
  previous(): FinancialPeriod<T>;
}
