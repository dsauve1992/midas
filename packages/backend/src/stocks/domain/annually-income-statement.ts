import { RecordedAnnuallyIncomeStatement } from './recorded-annually-income-statement';
import { MissingAnnuallyIncomeStatement } from './missing-annualy-income-statement';

export type AnnuallyIncomeStatementHistory = AnnuallyIncomeStatement[];

export type AnnuallyIncomeStatement =
  | RecordedAnnuallyIncomeStatement
  | MissingAnnuallyIncomeStatement;
