import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { subDays } from 'date-fns';
import { DataFrame } from 'danfojs-node';
import { SMA } from 'technicalindicators';

@Injectable()
export class ComputeAverageDailyRangeUseCase {
  constructor(
    private financialModelingPrepFetcherService: FinancialModelingPrepService,
  ) {}

  async execute(symbol: string) {
    const history =
      await this.financialModelingPrepFetcherService.getHistoricalChart(
        symbol,
        '1day',
        {
          from: subDays(new Date(), 100),
        },
      );

    const df = new DataFrame(history.reverse());

    // Calculer le plus haut quotidien (high) et le plus bas quotidien (low)
    const dhigh = df['high'].values;

    const dlow = df['low'].values;

    // Calculer le ratio dhigh/dlow
    const ratio = dhigh.map((value, index) => value / dlow[index]);

    // Calculer la moyenne mobile simple (SMA) à l'aide de la bibliothèque "technicalindicators"
    const smaResult = SMA.calculate({ values: ratio, period: 20 }).map(
      (result) => result,
    );

    // Calculer l'ADR en pourcentage
    return smaResult.map((value) => 100 * (value - 1))[smaResult.length - 1];
  }
}
