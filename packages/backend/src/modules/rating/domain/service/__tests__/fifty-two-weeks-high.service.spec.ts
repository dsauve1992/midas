import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { FinancialModelingPrepService } from '../../../../historical-data/financial-modeling-prep.service';
import { Test } from '@nestjs/testing';
import * as sampleHistory from './__fixtures__/OHLCV.sample.json';
import { FiftyTwoWeeksHighService } from '../fifty-two-weeks-high.service';

describe('Fifty two weeks specs', () => {
  let service: FiftyTwoWeeksHighService;
  let fmpService: DeepMocked<FinancialModelingPrepService>;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        FiftyTwoWeeksHighService,
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    service = app.get(FiftyTwoWeeksHighService);
    fmpService = app.get(FinancialModelingPrepService);
  });

  test('it should the number of days since last fifty two weeks high', async () => {
    fmpService.getHistoricalChart.mockResolvedValue(sampleHistory);

    const indicators = await service.getNumberOfDaysSinceLast52WeekHigh('AAPL');

    expect(indicators).toEqual(7);
  });
});
