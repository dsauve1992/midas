import { RecordedIncomeStatement } from './recorded-income-statement';
import { MissingIncomeStatement } from './missing-income-statement';

export type IncomeStatementHistory = IncomeStatement[];

export type IncomeStatement = RecordedIncomeStatement | MissingIncomeStatement;
