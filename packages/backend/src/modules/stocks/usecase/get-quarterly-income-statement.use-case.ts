import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { FinancialQuarter } from '../../rating/domain/FinancialQuarter';
import { keyBy } from 'lodash';
import { RecordedQuarterlyIncomeStatement } from '../domain/recorded-quarterly-income-statement';
import { MissingQuarterlyIncomeStatement } from '../domain/missing-quarterly-income-statement';
import { QuarterlyIncomeStatementHistory } from '../domain/quarterly-income-statement';

@Injectable()
export class GetQuarterlyIncomeStatementUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string): Promise<QuarterlyIncomeStatementHistory> {
    const [incomeStatements, enterpriseRatios] = await Promise.all([
      this.financialModelingPrepService.getIncomeStatements(symbol, {
        period: 'quarter',
        limit: '20',
      }),
      this.financialModelingPrepService.getEnterpriseRatios(symbol, {
        period: 'quarter',
        limit: '20',
      }),
    ]);

    const enterpriseRatiosMapByQuarter = keyBy(
      enterpriseRatios.map(({ period, calendarYear, netProfitMargin }) => ({
        quarter: new FinancialQuarter(
          parseInt(period.slice(1, 2)),
          parseInt(calendarYear),
        ),
        netProfitMargin,
      })),
      (value) => value.quarter.toString(),
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
      quarter: FinancialQuarter;
    })[] = incomeStatements.map(
      ({ date, acceptedDate, period, revenue, epsdiluted, calendarYear }) => {
        const quarter = new FinancialQuarter(
          parseInt(period.slice(1, 2)),
          parseInt(calendarYear),
        );
        return {
          date,
          acceptedDate,
          quarter: quarter,
          sales: revenue,
          eps: epsdiluted,
          netProfitMargin:
            enterpriseRatiosMapByQuarter[quarter.toString()]?.netProfitMargin,
        };
      },
    );

    let i = 1;

    while (true) {
      const previousRecordedQuarter =
        incomeStatementsWithNetProfitMargin[i - 1].quarter;
      const currentRecordedQuarter =
        incomeStatementsWithNetProfitMargin[i]?.quarter;

      if (
        !currentRecordedQuarter ||
        !previousRecordedQuarter.previous().isEqual(currentRecordedQuarter)
      ) {
        incomeStatementsWithNetProfitMargin.splice(i, 0, {
          quarter: previousRecordedQuarter.previous(),
          status: 'missing',
        });
      }

      if (++i === 8) {
        break;
      }
    }

    return incomeStatementsWithNetProfitMargin.map((record, index) => {
      if ('status' in record) {
        return new MissingQuarterlyIncomeStatement(record.quarter);
      } else if ('eps' in record) {
        const sameQuarterOneYearBefore =
          incomeStatementsWithNetProfitMargin[index + 4];

        return new RecordedQuarterlyIncomeStatement({
          quarter: record.quarter,
          acceptedDate: record.acceptedDate,

          earnings: {
            current: record.eps,
            previous:
              sameQuarterOneYearBefore && 'eps' in sameQuarterOneYearBefore
                ? sameQuarterOneYearBefore?.eps
                : undefined,
            growth:
              sameQuarterOneYearBefore && 'eps' in sameQuarterOneYearBefore
                ? this.computeGrowth(
                    record.eps,
                    sameQuarterOneYearBefore?.eps,
                    3,
                  )
                : undefined,
          },
          sales: {
            current: record.sales,
            previous:
              sameQuarterOneYearBefore && 'sales' in sameQuarterOneYearBefore
                ? sameQuarterOneYearBefore?.sales
                : undefined,
            growth:
              sameQuarterOneYearBefore && 'sales' in sameQuarterOneYearBefore
                ? this.computeGrowth(
                    record.sales,
                    sameQuarterOneYearBefore?.sales,
                    3,
                  )
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
