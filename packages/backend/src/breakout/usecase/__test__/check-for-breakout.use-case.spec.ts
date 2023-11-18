import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckForBreakoutUseCase } from '../check-for-breakout.use-case';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TimeFrame } from '../../../shared-types/financial-modeling-prep';
import { readFileSync } from 'fs';
import * as path from 'path';

describe('CheckForBreakoutUseCase specs', () => {
  let useCase: CheckForBreakoutUseCase;
  let fmpService: DeepMocked<FinancialModelingPrepService>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        CheckForBreakoutUseCase,
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    useCase = app.get(CheckForBreakoutUseCase);
    fmpService = app.get(FinancialModelingPrepService);

    fmpService.getHistoricalChart.mockImplementation(
      async (symbol: string, timeframe: TimeFrame) => {
        const json = JSON.parse(
          readFileSync(
            path.resolve(__dirname, `./__data__/${symbol}/${timeframe}.json`),
            'utf8',
          ),
        );

        return Promise.resolve(json);
      },
    );
  });

  it.each(['FUBO', 'MPTI', 'MYO'])('for symbol %s', async (symbol) => {
    const validSignal = await useCase.execute(symbol);
    expect(validSignal).toBe(true);
  });
});
