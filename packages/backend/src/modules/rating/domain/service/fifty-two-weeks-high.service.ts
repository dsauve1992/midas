import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { subDays } from 'date-fns';
import { DataFrame } from 'danfojs-node';

@Injectable()
export class FiftyTwoWeeksHighService {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async getNumberOfDaysSinceLast52WeekHigh(symbol: string) {
    try {
      const history =
        await this.financialModelingPrepFetcherService.getHistoricalChart(
          symbol,
          '1day',
          {
            from: subDays(new Date(), 260),
          },
        );

      const df = new DataFrame(history.reverse());

      // Calculer le plus haut quotidien (high) et le plus bas quotidien (low)
      const dhigh = df['high'].values as number[];
      const _52weeksHigh = Math.max(...dhigh);

      return dhigh.reverse().findIndex((high) => high === _52weeksHigh) + 1;
    } catch (e) {
      return -1;
    }
  }
}
