import { RiskRewardRatioStrategy } from '../risk-reward-ratio-strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { UseCaseTestModule } from '../../../../../../../lib/test/use-case/use-case-test.module';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HistoricalPriceService } from '../../../service/historical-price-service';
import { givenOngoingPosition } from '../../__tests__/__fixtures__/ongoing-position.fixture';
import { when } from 'jest-when';
import { OngoingPositionRepository } from '../../../repository/ongoing-position.repository';
import { TelegramService } from '../../../../../../telegram/telegram.service';
import { PositionStatus } from '../../position-status';
import { StopLossHitEvent } from '../../stop-loss-hit-event';

const NOW = new Date('2021-01-01T00:00:00Z');

describe('RiskRewardRatioStrategy', () => {
  let riskRewardRatioStrategy: RiskRewardRatioStrategy;
  let historicalPriceService: DeepMocked<HistoricalPriceService>;
  let ongoingPositionRepository: DeepMocked<OngoingPositionRepository>;
  let telegramService: DeepMocked<TelegramService>;

  beforeAll(() => jest.useFakeTimers().setSystemTime(NOW));
  afterAll(() => jest.useRealTimers());

  beforeEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        RiskRewardRatioStrategy,
        {
          provide: 'OngoingPositionRepository',
          useValue: createMock<OngoingPositionRepository>(),
        },
        {
          provide: HistoricalPriceService,
          useValue: createMock<HistoricalPriceService>(),
        },
        {
          provide: TelegramService,
          useValue: createMock<TelegramService>(),
        },
      ],
    }).compile();

    riskRewardRatioStrategy = app.get(RiskRewardRatioStrategy);
    historicalPriceService = app.get(HistoricalPriceService);
    telegramService = app.get(TelegramService);
    ongoingPositionRepository = app.get('OngoingPositionRepository');
  });

  test('when user confirms selling, it should set registered stop loss hit event with provided selling price and set position to complete', async () => {
    const ongoingPosition = givenOngoingPosition({
      buyPrice: 100,
      stopLoss: 95,
    });

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(ongoingPosition.symbol)
      .mockResolvedValue({ high: 96, low: 94.9 });

    const validateStopLossOrderExecutionPromise = Promise.resolve(94.9);
    when(telegramService.validateStopLossOrderExecution).mockResolvedValue(
      validateStopLossOrderExecutionPromise,
    );

    await riskRewardRatioStrategy.apply(ongoingPosition);
    await validateStopLossOrderExecutionPromise;

    expect(ongoingPositionRepository.save).toHaveBeenNthCalledWith(
      1,
      givenOngoingPosition({
        ...ongoingPosition,
        status: PositionStatus.COMPLETED,
        events: [
          new StopLossHitEvent({
            sellingPrice: 94.9,
            timestamp: NOW,
          }),
        ],
      }),
    );
  });

  test('when user refutes selling, it should do nothing', async () => {
    const ongoingPosition = givenOngoingPosition({
      buyPrice: 100,
      stopLoss: 95,
    });

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(ongoingPosition.symbol)
      .mockResolvedValue({ high: 96, low: 94.9 });

    const validateStopLossOrderExecutionPromise = Promise.resolve(null);
    when(telegramService.validateStopLossOrderExecution).mockResolvedValue(
      validateStopLossOrderExecutionPromise,
    );

    await riskRewardRatioStrategy.apply(ongoingPosition);
    await validateStopLossOrderExecutionPromise;

    expect(ongoingPositionRepository.save).not.toHaveBeenCalled();
  });
});
