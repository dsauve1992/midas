import { Injectable } from '@nestjs/common';
import { MissingQuarterlyIncomeStatement } from '../../domain/missing-quarterly-income-statement';
import { RecordedQuarterlyIncomeStatement } from '../../domain/recorded-quarterly-income-statement';
import { QuarterlyIncomeStatement } from '../../domain/quarterly-income-statement';
import { IncomeStatementDto } from '../../../shared-types/income-statement';

@Injectable()
export class QuarterlyIncomeStatementMapper {
  toDto(quarterlyIncomeStatement: QuarterlyIncomeStatement) {
    if (quarterlyIncomeStatement instanceof MissingQuarterlyIncomeStatement) {
      return this.fromMissingIncomeStatement(quarterlyIncomeStatement);
    } else if (
      quarterlyIncomeStatement instanceof RecordedQuarterlyIncomeStatement
    ) {
      return this.fromRecordedIncomeStatement(quarterlyIncomeStatement);
    }
  }

  private fromRecordedIncomeStatement(
    incomeStatement: RecordedQuarterlyIncomeStatement,
  ): IncomeStatementDto {
    return {
      period: incomeStatement.model.quarter.toString(),
      acceptedDate: incomeStatement.model.acceptedDate,
      earnings: incomeStatement.model.earnings,
      sales: incomeStatement.model.sales,
      netProfitMargin: incomeStatement.model.netProfitMargin,
    };
  }

  private fromMissingIncomeStatement(
    incomeStatement: MissingQuarterlyIncomeStatement,
  ): IncomeStatementDto {
    return {
      period: incomeStatement.quarter.toString(),
    };
  }
}
