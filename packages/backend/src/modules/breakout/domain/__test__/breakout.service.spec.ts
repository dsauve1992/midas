import { FinancialModelingPrepService } from '../../../historical-data/financial-modeling-prep.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BreakoutService } from '../breakout.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TimeFrame } from '../../../../shared-types/financial-modeling-prep';
import { readFileSync } from 'fs';
import * as path from 'path';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StockBreakoutEvent } from '../event/stock-breakout.event';

describe('BreakoutService specs', () => {
  let service: BreakoutService;
  let fmpService: DeepMocked<FinancialModelingPrepService>;
  let eventEmitter: DeepMocked<EventEmitter2>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        BreakoutService,
        {
          provide: EventEmitter2,
          useValue: createMock<EventEmitter2>(),
        },
        {
          provide: FinancialModelingPrepService,
          useValue: createMock<FinancialModelingPrepService>(),
        },
      ],
    }).compile();

    service = app.get(BreakoutService);
    fmpService = app.get(FinancialModelingPrepService);
    eventEmitter = app.get(EventEmitter2);

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

  it.each(['FUBO', 'MPTI', 'MYO'])(
    `for symbol %s, it should emit a ${StockBreakoutEvent.TYPE} when breakout occurs`,
    async (symbol) => {
      await service.checkFor(symbol);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        StockBreakoutEvent.TYPE,
        expect.any(StockBreakoutEvent),
      );
    },
  );
});
