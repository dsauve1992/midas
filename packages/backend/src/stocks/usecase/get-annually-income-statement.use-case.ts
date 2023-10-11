import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { keyBy } from 'lodash';
import { AnnuallyIncomeStatementHistory } from '../domain/annually-income-statement';
import { MissingAnnuallyIncomeStatement } from '../domain/missing-annualy-income-statement';
import { RecordedAnnuallyIncomeStatement } from '../domain/recorded-annually-income-statement';

@Injectable()
export class GetAnnuallyIncomeStatementUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string): Promise<AnnuallyIncomeStatementHistory> {
    const [incomeStatements, enterpriseRatios] = await Promise.all([
      this.financialModelingPrepService.getIncomeStatements(symbol, {
        limit: '20',
      }),
      this.financialModelingPrepService.getEnterpriseRatios(symbol, {
        limit: '20',
      }),
    ]);

    const enterpriseRatiosMapByQuarter = keyBy(
      enterpriseRatios.map(({ calendarYear, netProfitMargin }) => ({
        year: calendarYear,
        netProfitMargin,
      })),
      (value) => value.year.toString(),
    );

    const incomeStatementsWithNetProfitMargin: ((
      | { status: 'missing' }
      | {
          date: string;
          acceptedDate: string;
          sales: number;
          eps: number;
          netProfitMargin: number;
        }
    ) & {
      year: number;
    })[] = incomeStatements.map(
      ({ date, acceptedDate, revenue, epsdiluted, calendarYear }) => {
        return {
          date,
          acceptedDate,
          year: parseInt(calendarYear),
          sales: revenue,
          eps: epsdiluted,
          netProfitMargin:
            enterpriseRatiosMapByQuarter[calendarYear]?.netProfitMargin,
        };
      },
    );

    let i = 1;

    while (true) {
      const previousRecordedYear =
        incomeStatementsWithNetProfitMargin[i - 1].year;
      const currentRecordedYear = incomeStatementsWithNetProfitMargin[i]?.year;

      if (
        !currentRecordedYear ||
        previousRecordedYear - 1 != currentRecordedYear
      ) {
        incomeStatementsWithNetProfitMargin.splice(i, 0, {
          year: previousRecordedYear - 1,
          status: 'missing',
        });
      }

      if (++i === 8) {
        break;
      }
    }

    return incomeStatementsWithNetProfitMargin.map((record, index) => {
      if ('status' in record) {
        return new MissingAnnuallyIncomeStatement(record.year);
      } else if ('eps' in record) {
        const oneYearBefore = incomeStatementsWithNetProfitMargin[index + 1];

        return new RecordedAnnuallyIncomeStatement({
          year: record.year,
          acceptedDate: record.acceptedDate,
          earnings: {
            current: record.eps,
            previous:
              oneYearBefore && 'eps' in oneYearBefore
                ? oneYearBefore?.eps
                : undefined,
            growth:
              oneYearBefore && 'eps' in oneYearBefore
                ? this.computeGrowth(record.eps, oneYearBefore?.eps, 3)
                : undefined,
          },
          sales: {
            current: record.sales,
            previous:
              oneYearBefore && 'sales' in oneYearBefore
                ? oneYearBefore?.sales
                : undefined,
            growth:
              oneYearBefore && 'sales' in oneYearBefore
                ? this.computeGrowth(record.sales, oneYearBefore?.sales, 3)
                : undefined,
          },
          netProfitMargin: record.netProfitMargin,
        });
      }
    });
  }

  computeGrowth(current: number, previous: number, precision?: number): number {
    return parseFloat(
      (((current - previous) / Math.abs(previous)) * 100).toPrecision(
        precision,
      ),
    );
  }
}
