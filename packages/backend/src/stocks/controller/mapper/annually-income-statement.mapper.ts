import { Injectable } from '@nestjs/common';

import { AnnuallyIncomeStatement } from '../../domain/annually-income-statement';
import { MissingAnnuallyIncomeStatement } from '../../domain/missing-annualy-income-statement';
import { RecordedAnnuallyIncomeStatement } from '../../domain/recorded-annually-income-statement';
import { IncomeStatementDto } from '../../../shared-types/income-statement';

@Injectable()
export class AnnuallyIncomeStatementMapper {
  toDto(annuallyIncomeStatement: AnnuallyIncomeStatement) {
    if (annuallyIncomeStatement instanceof MissingAnnuallyIncomeStatement) {
      return this.fromMissingIncomeStatement(annuallyIncomeStatement);
    } else if (
      annuallyIncomeStatement instanceof RecordedAnnuallyIncomeStatement
    ) {
      return this.fromRecordedIncomeStatement(annuallyIncomeStatement);
    }
  }

  private fromRecordedIncomeStatement(
    incomeStatement: RecordedAnnuallyIncomeStatement,
  ): IncomeStatementDto {
    return {
      period: `FY - ${incomeStatement.model.year}`,
      acceptedDate: incomeStatement.model.acceptedDate,
      earnings: incomeStatement.model.earnings,
      sales: incomeStatement.model.sales,
      netProfitMargin: incomeStatement.model.netProfitMargin,
    };
  }

  private fromMissingIncomeStatement(
    incomeStatement: MissingAnnuallyIncomeStatement,
  ): IncomeStatementDto {
    return {
      period: `FY - ${incomeStatement.year}`,
    };
  }
}
