import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { FinancialModelingPrepService } from '../../../../historical-data/financial-modeling-prep.service';
import { Test } from '@nestjs/testing';
import { TechnicalIndicatorService } from '../technical-indicator.service';
import * as sampleHistory from './__fixtures__/OHLCV.sample.json';

describe('TechnicalIndicatorService specs', () => {
  let service: TechnicalIndicatorService;
  let fmpService: DeepMocked<FinancialModelingPrepService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        TechnicalIndicatorService,
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    service = app.get(TechnicalIndicatorService);
    fmpService = app.get(FinancialModelingPrepService);
  });

  test('it should return current moving averages values and high/low ratios', async () => {
    fmpService.getHistoricalChart.mockResolvedValue(sampleHistory);

    const indicators = await service.getTechnicalIndicators('AAPL');

    expect(indicators).toEqual({
      currentSma200: 178.65,
      currentSma150: 183.36,
      currentSma50: 185.4,
      currentEma20: 193.33,
      currentEma10: 194.96,
      currentPrice: 193.6,
      sma200LastMonthPerformance: 2.47,
      highRatio: 3.02,
      lowRatio: 55.92,
    });
  });
});
