import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { MonitorPendingPositionWishesUseCase } from '../monitor-pending-position-wishes.use-case';
import { when } from 'jest-when';
import { givenPendingPositionWish } from '../../domain/model/__tests__/__fixtures__/position-wish.fixture';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { HistoricalPriceService } from '../../domain/service/historical-price-service';
import { TelegramService } from '../../../../telegram/telegram.service';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { OngoingPosition } from '../../domain/model/ongoing-position';
import { IdGenerator } from '../../../../../lib/domain/IdGenerator';
import { v4 as uuidv4 } from 'uuid';
import { PositionId } from '../../domain/model/position-id';
import { PositionWish } from '../../domain/model/position-wish';
import { PositionWishStatus } from '../../domain/model/position-wish-status';
import { PositionStatus } from '../../domain/model/position-status';
import { StrategyName } from '../../domain/model/strategy/strategy-name';

jest.mock('../../../../../lib/domain/IdGenerator');

const AN_ID = uuidv4();

const A_POSITION_ID = PositionId.from(AN_ID);

const NASDAQ_AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const NASDAQ_MSFT = SymbolWithExchange.from('NASDAQ:MSFT');
const NASDAQ_GOOGL = SymbolWithExchange.from('NASDAQ:GOOGL');

const NOW = new Date('2020-01-01');

describe('MonitorPendingPositionWishesUseCase specs', () => {
  let useCase: MonitorPendingPositionWishesUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;
  let ongoingPositionRepository: DeepMocked<OngoingPositionRepository>;
  let historicalPriceService: DeepMocked<HistoricalPriceService>;
  let telegramService: DeepMocked<TelegramService>;

  beforeAll(() => jest.useFakeTimers().setSystemTime(NOW));
  beforeEach(() => jest.clearAllMocks());

  afterAll(() => jest.useRealTimers());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        MonitorPendingPositionWishesUseCase,
        {
          provide: 'PositionWishRepository',
          useValue: createMock<PositionWishRepository>(),
        },
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

    useCase = app.get(MonitorPendingPositionWishesUseCase);
    historicalPriceService = app.get(HistoricalPriceService);
    telegramService = app.get(TelegramService);
    positionWishRepository = app.get('PositionWishRepository');
    ongoingPositionRepository = app.get('OngoingPositionRepository');

    jest.mocked(IdGenerator.generateUUIDv4).mockReturnValue(AN_ID);
  });

  test('given pending position wishes, when stop loss has been reached, it should ask user to cancel position', async () => {
    when(positionWishRepository.getAllPending).mockResolvedValue([
      givenPendingPositionWish({
        entryPrice: 100,
        stopLoss: 95,
        symbol: NASDAQ_AAPL,
      }),
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 96, low: 94.9 });

    when(
      telegramService.askUserToCancelOrderBecauseStopLossHasBeenHit,
    ).mockResolvedValue(true);

    await useCase.execute();

    expect(
      telegramService.askUserToCancelOrderBecauseStopLossHasBeenHit,
    ).toHaveBeenCalledWith(NASDAQ_AAPL, 95);
  });

  test('given user confirms the order cancellation, then it should set wish status to STOP_LOSS_HIT and persist it', async () => {
    const aPositionWish = givenPendingPositionWish({
      entryPrice: 100,
      stopLoss: 95,
      symbol: NASDAQ_AAPL,
    });
    when(positionWishRepository.getAllPending).mockResolvedValue([
      aPositionWish,
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 96, low: 94.9 });

    const askUserToCancelOrderBecauseStopLossHasBeenHitPromise =
      Promise.resolve(true);
    when(
      telegramService.askUserToCancelOrderBecauseStopLossHasBeenHit,
    ).mockResolvedValue(askUserToCancelOrderBecauseStopLossHasBeenHitPromise);

    await useCase.execute();
    await askUserToCancelOrderBecauseStopLossHasBeenHitPromise;

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        ...aPositionWish,
        status: PositionWishStatus.STOP_LOSS_HIT,
      }),
    );
  });

  test('given user refutes the order cancellation, then it should do nothing', async () => {
    const aPositionWish = givenPendingPositionWish({
      entryPrice: 100,
      stopLoss: 95,
      symbol: NASDAQ_AAPL,
    });
    when(positionWishRepository.getAllPending).mockResolvedValue([
      aPositionWish,
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 96, low: 94.9 });

    const askUserToCancelOrderBecauseStopLossHasBeenHitPromise =
      Promise.resolve(false);
    when(
      telegramService.askUserToCancelOrderBecauseStopLossHasBeenHit,
    ).mockResolvedValue(askUserToCancelOrderBecauseStopLossHasBeenHitPromise);

    await useCase.execute();
    await askUserToCancelOrderBecauseStopLossHasBeenHitPromise;

    expect(positionWishRepository.save).not.toHaveBeenCalled();
  });

  test('given pending position wishes, when entry price has been reached, it should ask confirmation through telegram bot', async () => {
    when(positionWishRepository.getAllPending).mockResolvedValue([
      givenPendingPositionWish({
        entryPrice: 100,
        stopLoss: 90,
        symbol: NASDAQ_AAPL,
      }),
      givenPendingPositionWish({
        entryPrice: 150,
        stopLoss: 140,
        symbol: NASDAQ_MSFT,
      }),
      givenPendingPositionWish({
        entryPrice: 200,
        stopLoss: 180,
        symbol: NASDAQ_GOOGL,
      }),
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 99, low: 98 });
    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_MSFT)
      .mockResolvedValue({ high: 150, low: 145 });
    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_GOOGL)
      .mockResolvedValue({ high: 201, low: 198 });

    when(telegramService.validateBuyOrderExecution).mockResolvedValue(101.5);

    await useCase.execute();

    expect(telegramService.validateBuyOrderExecution.mock.calls).toEqual([
      [NASDAQ_MSFT, 140],
      [NASDAQ_GOOGL, 180],
    ]);
  });

  test('given user refutes the order execution, then it should do nothing', async () => {
    const aPendingPositionWish = givenPendingPositionWish({
      entryPrice: 100,
      stopLoss: 90,
      symbol: NASDAQ_AAPL,
    });
    when(positionWishRepository.getAllPending).mockResolvedValue([
      aPendingPositionWish,
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 101, low: 94.9 });

    when(telegramService.validateBuyOrderExecution)
      .calledWith(NASDAQ_AAPL, aPendingPositionWish.stopLoss)
      .mockResolvedValue(null);

    await useCase.execute();

    expect(positionWishRepository.save).not.toHaveBeenCalled();

    expect(ongoingPositionRepository.save).not.toHaveBeenCalled();
  });

  test('given user confirms for order execution with buyPrice, then it should set wish to executed, create ongoing position and persist them', async () => {
    const aPendingPositionWish = givenPendingPositionWish({
      entryPrice: 100,
      stopLoss: 90,
      symbol: NASDAQ_AAPL,
    });
    when(positionWishRepository.getAllPending).mockResolvedValue([
      aPendingPositionWish,
    ]);

    when(historicalPriceService.getLast15MinPriceRangeFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue({ high: 101, low: 94.9 });

    const validateBuyOrderExecutionPromise = Promise.resolve(101.5);
    when(telegramService.validateBuyOrderExecution)
      .calledWith(NASDAQ_AAPL, aPendingPositionWish.stopLoss)
      .mockResolvedValue(validateBuyOrderExecutionPromise);

    await useCase.execute();
    await validateBuyOrderExecutionPromise;

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        ...aPendingPositionWish,
        status: PositionWishStatus.EXECUTED,
      }),
    );

    expect(ongoingPositionRepository.save).toHaveBeenCalledWith(
      new OngoingPosition({
        id: A_POSITION_ID,
        positionWishId: aPendingPositionWish.id,
        userId: aPendingPositionWish.userId,
        symbol: aPendingPositionWish.symbol,
        buyPrice: 101.5,
        stopLoss: aPendingPositionWish.stopLoss,
        quantity: aPendingPositionWish.quantity,
        createdAt: NOW,
        status: PositionStatus.ONGOING,
        strategyName: StrategyName.RISK_REWARD_RATIO,
        events: [],
      }),
    );
  });
});
