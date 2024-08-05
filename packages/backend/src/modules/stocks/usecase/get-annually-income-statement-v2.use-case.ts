import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { chain, uniq } from 'lodash';
import { FinancialPeriod } from '../../rating/domain/FinancialPeriod';
import {
  AnalystEstimateEntry,
  EnterpriseRatio,
  IncomeStatementDto,
} from '../../../shared-types/financial-modeling-prep';
import { FinancialYear } from '../../rating/domain/FinancialYear';
import { FinancialRecordDto } from '../../../shared-types/income-statement';

type FinancialMetricType = 'eps' | 'revenue' | 'profitMargin';

class FinancialRecordComparison<T extends FinancialPeriod<T>> {
  constructor(
    public readonly period: FinancialPeriod<T>,
    public readonly acceptedDate: string,
    public readonly netProfitMargin: FinancialMetric,
    public readonly sales: FinancialMetricComparison,
    public readonly earnings: FinancialMetricComparison,
    public readonly estimate: boolean,
  ) {}

  toDto() {
    return {
      period: this.period.toString(),
      acceptedDate: this.acceptedDate,
      netProfitMargin: this.netProfitMargin.value,
      sales: this.sales.toDto(),
      earnings: this.earnings.toDto(),
      estimate: this.estimate,
    };
  }
}

class FinancialMetricComparison {
  constructor(
    private current: FinancialMetric,
    private previous: FinancialMetric,
  ) {
    if (current.name !== previous.name) {
      throw new Error('current and previous must have same type');
    }
  }

  getPercentage(precision: number = 4): number {
    const value =
      ((this.current.value - this.previous.value) /
        Math.abs(this.previous.value)) *
      100;

    return +value.toPrecision(precision);
  }

  toString(): string {
    return `${this.getPercentage().toFixed(2)}%`;
  }

  toDto() {
    return {
      current: this.current.value,
      previous: this.previous.value,
      growth: this.getPercentage(),
    };
  }
}

class FinancialMetric {
  constructor(
    public readonly name: FinancialMetricType,
    public readonly value: number | null,
  ) {}
}

class FinancialRecord<T extends FinancialPeriod<T>> {
  public readonly metrics: Map<FinancialMetricType, FinancialMetric>;

  constructor(
    public period: T,
    public acceptedDate: string | null, //TODO date
    metrics: Map<FinancialMetricType, FinancialMetric>,
    private estimate: boolean,
  ) {
    this.metrics = new Map([
      ...new Map<FinancialMetricType, FinancialMetric>([
        ['eps', new FinancialMetric('eps', null)],
        ['revenue', new FinancialMetric('revenue', null)],
        ['profitMargin', new FinancialMetric('profitMargin', null)],
      ]),
      ...metrics,
    ]);
  }

  static empty<T extends FinancialPeriod<T>>(period: T): FinancialRecord<T> {
    return new FinancialRecord(period, null, new Map([]), false);
  }

  compareFrom(
    previous: FinancialRecord<T> | undefined,
  ): FinancialRecordComparison<T> {
    return new FinancialRecordComparison(
      this.period,
      this.acceptedDate,
      this.metrics.get('profitMargin'),
      new FinancialMetricComparison(
        this.metrics.get('revenue'),
        previous
          ? previous.metrics.get('revenue')
          : new FinancialMetric('revenue', null),
      ),
      new FinancialMetricComparison(
        this.metrics.get('eps'),
        previous
          ? previous.metrics.get('eps')
          : new FinancialMetric('eps', null),
      ),
      this.estimate,
    );
  }
}

class AnnuallyFinancialHistory {
  public readonly history: FinancialRecord<FinancialYear>[];

  constructor(_history: FinancialRecord<FinancialYear>[]) {
    const periods = _history.map((record) => record.period.year);

    if (uniq(periods).length !== periods.length) {
      throw new Error('Duplicate periods');
    }

    this.history = AnnuallyFinancialHistory.fillMissingRecords(
      _history.sort((a, b) => a.period.compare(b.period)),
    );
  }

  private static fillMissingRecords(history: FinancialRecord<FinancialYear>[]) {
    console.log(history);

    if (history.length < 2) {
      return history;
    }

    const filledHistory: FinancialRecord<FinancialYear>[] = [history[0]];

    for (let i = 1; i < history.length; i++) {
      const currentRecord = history[i];

      while (
        !filledHistory[filledHistory.length - 1].period
          .next()
          .isEqual(currentRecord.period)
      ) {
        filledHistory.push(
          FinancialRecord.empty(
            filledHistory[filledHistory.length - 1].period.next(),
          ),
        );
      }

      filledHistory.push(currentRecord);
    }

    return filledHistory;
  }

  toFinancialRecordDtos(): FinancialRecordDto[] {
    return this.history.map((record, index) => {
      const previousRecord: FinancialRecord<any> | undefined =
        index > 0 ? this.history[index - 1] : undefined;

      return record.compareFrom(previousRecord).toDto();
    });
  }
}

@Injectable()
export class GetAnnuallyIncomeStatementV2UseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string): Promise<AnnuallyFinancialHistory> {
    const { incomeStatements, enterpriseRatios, analystEstimates } =
      await this.fetchData(symbol);

    console.log(enterpriseRatios);

    const entries = this.mapToFinancialRecords(
      incomeStatements,
      enterpriseRatios,
      analystEstimates,
    );

    return new AnnuallyFinancialHistory(entries);
  }

  private mapToFinancialRecords(
    incomeStatements: IncomeStatementDto[],
    enterpriseRatios: EnterpriseRatio[],
    analystEstimates: AnalystEstimateEntry[],
  ) {
    const foo =
      +incomeStatements[0].calendarYear -
      parseInt(incomeStatements[0].date.split('-')[0]);

    const recorded = chain([...incomeStatements, ...enterpriseRatios])
      .groupBy('date')
      .mapValues((el) => {
        const mergedData: IncomeStatementDto & EnterpriseRatio = Object.assign(
          {},
          ...el,
        );

        return new FinancialRecord(
          new FinancialYear(+mergedData.calendarYear),
          mergedData.acceptedDate,
          new Map(
            [
              new FinancialMetric('eps', mergedData.epsdiluted),
              new FinancialMetric('revenue', mergedData.revenue),
              new FinancialMetric('profitMargin', mergedData.netProfitMargin),
            ]
              .filter(Boolean)
              .map((metric) => [metric.name, metric]),
          ),
          false,
        );
      })
      .values()
      .orderBy((el) => el.period.year, 'desc')
      .value()
      .slice(0, 5);

    const estimated = chain(analystEstimates)
      .map(
        (el) =>
          new FinancialRecord(
            new FinancialYear(parseInt(el.date.split('-')[0]) + foo),
            undefined,
            new Map(
              [
                new FinancialMetric('eps', el.estimatedEpsAvg),
                new FinancialMetric('revenue', el.estimatedRevenueAvg),
              ].map((metric) => [metric.name, metric]),
            ),
            true,
          ),
      )
      .filter((el) => el.period.year > recorded[0].period.year)
      .orderBy((el) => el.period.year, 'asc')
      .slice(0, 2)
      .orderBy((el) => el.period.year, 'desc')
      .value();

    return [...estimated, ...recorded];
  }

  private async fetchData(symbol: string) {
    const [incomeStatements, enterpriseRatios, analystEstimates] =
      await Promise.all([
        this.financialModelingPrepService.getIncomeStatements(symbol, {
          limit: '6',
        }),
        this.financialModelingPrepService.getEnterpriseRatios(symbol, {
          limit: '6',
        }),
        this.financialModelingPrepService.getAnalystEstimates(symbol, {
          period: 'annual',
          limit: '5',
        }),
      ]);
    return { incomeStatements, enterpriseRatios, analystEstimates };
  }
}
