import { RecordedQuarterlyIncomeStatement } from './recorded-quarterly-income-statement';
import { MissingQuarterlyIncomeStatement } from './missing-quarterly-income-statement';

export type QuarterlyIncomeStatementHistory = QuarterlyIncomeStatement[];

export type QuarterlyIncomeStatement =
  | RecordedQuarterlyIncomeStatement
  | MissingQuarterlyIncomeStatement;
