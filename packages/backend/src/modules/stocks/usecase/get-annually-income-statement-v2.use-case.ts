import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { chain } from 'lodash';
import { FinancialPeriod } from '../../rating/domain/FinancialPeriod';
import {
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
  ) {}

  toDto() {
    return {
      period: this.period.toString(),
      acceptedDate: this.acceptedDate,
      netProfitMargin: this.netProfitMargin.value,
      sales: this.sales.toDto(),
      earnings: this.earnings.toDto(),
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

  getPercentage(): number {
    return (
      ((this.current.value - this.previous.value) /
        Math.abs(this.previous.value)) *
      100
    );
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
    return new FinancialRecord(period, null, new Map([]));
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
    );
  }
}

class AnnuallyFinancialHistory {
  public readonly history: FinancialRecord<FinancialYear>[];

  constructor(_history: FinancialRecord<FinancialYear>[]) {
    this.history = AnnuallyFinancialHistory.fillMissingRecords(
      _history.sort((a, b) => a.period.compare(b.period)),
    );
  }

  private static fillMissingRecords(history: FinancialRecord<FinancialYear>[]) {
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
    const { incomeStatements, enterpriseRatios } = await this.fetchData(symbol);
    const entries = this.mapToFinancialRecords(
      incomeStatements,
      enterpriseRatios,
    );

    return new AnnuallyFinancialHistory(entries);
  }

  private mapToFinancialRecords(
    incomeStatements: IncomeStatementDto[],
    enterpriseRatios: EnterpriseRatio[],
  ) {
    return chain([...incomeStatements, ...enterpriseRatios])
      .groupBy('calendarYear')
      .mapValues((el) => {
        const mergedData: IncomeStatementDto & EnterpriseRatio = Object.assign(
          {},
          ...el,
        );

        return new FinancialRecord(
          new FinancialYear(parseInt(mergedData.calendarYear)),
          mergedData.acceptedDate,
          new Map(
            [
              mergedData.epsdiluted &&
                new FinancialMetric('eps', mergedData.epsdiluted),
              mergedData.revenue &&
                new FinancialMetric('revenue', mergedData.revenue),
              mergedData.netProfitMargin &&
                new FinancialMetric('profitMargin', mergedData.netProfitMargin),
            ]
              .filter(Boolean)
              .map((metric) => [metric.name, metric]),
          ),
        );
      })
      .values()
      .value();
  }

  private async fetchData(symbol: string) {
    const [incomeStatements, enterpriseRatios] = await Promise.all([
      this.financialModelingPrepService.getIncomeStatements(symbol, {
        limit: '20',
      }),
      this.financialModelingPrepService.getEnterpriseRatios(symbol, {
        limit: '20',
      }),
    ]);
    return { incomeStatements, enterpriseRatios };
  }
}
