import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { Quarter } from '../../rating/domain/Quarter';
import { keyBy } from 'lodash';

export interface IncomeStatementGrowthModel {
  quarter: Quarter;

  earnings: {
    current: number;
    growth?: number;
  };
  sales: {
    current: number;
    growth?: number;
  };
  netProfitMargin: number;
}

export class IncomeStatementGrowth {
  constructor(private model: IncomeStatementGrowthModel) {}

  toString(): string {
    return `${this.model.quarter} | Earnings : ${this.model.earnings.current} (${this.model.earnings.growth}%) | Sales : ${this.model.sales.current} (${this.model.sales.growth}%) | Net Profit Margin : ${this.model.netProfitMargin}`;
  }
}

@Injectable()
export class GetQuarterlyIncomeStatementUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string) {
    const [incomeStatements, enterpriseRatios] = await Promise.all([
      this.financialModelingPrepService.getIncomeStatements(symbol, {
        period: 'quarter',
        limit: '8',
      }),
      this.financialModelingPrepService.getEnterpriseRatios(symbol, {
        period: 'quarter',
        limit: '8',
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
      if ('missing' in record) {
        return record;
      } else if ('eps' in record) {
        const sameQuarterOneYearBefore =
          incomeStatementsWithNetProfitMargin[index + 4];

        return new IncomeStatementGrowth({
          quarter: record.quarter,

          earnings: {
            current: record.eps,
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
