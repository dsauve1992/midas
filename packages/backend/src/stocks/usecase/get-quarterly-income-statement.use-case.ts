import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { Quarter } from '../../rating/domain/Quarter';
import { keyBy } from 'lodash';
import { RecordedIncomeStatement } from '../domain/recorded-income-statement';
import { MissingIncomeStatement } from '../domain/missing-income-statement';
import { IncomeStatementHistory } from '../domain/income-statement';

@Injectable()
export class GetQuarterlyIncomeStatementUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string): Promise<IncomeStatementHistory> {
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
        quarter: new Quarter(
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
      quarter: Quarter;
    })[] = incomeStatements.map(
      ({ date, acceptedDate, period, revenue, epsdiluted, calendarYear }) => {
        const quarter = new Quarter(
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
        !previousRecordedQuarter
          .previousQuarter()
          .isEqual(currentRecordedQuarter)
      ) {
        incomeStatementsWithNetProfitMargin.splice(i, 0, {
          quarter: previousRecordedQuarter.previousQuarter(),
          status: 'missing',
        });
      }

      if (++i === 8) {
        break;
      }
    }

    return incomeStatementsWithNetProfitMargin.map((record, index) => {
      if ('status' in record) {
        return new MissingIncomeStatement(record.quarter);
      } else if ('eps' in record) {
        const sameQuarterOneYearBefore =
          incomeStatementsWithNetProfitMargin[index + 4];

        return new RecordedIncomeStatement({
          quarter: record.quarter,

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
