import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase } from '../check-for-reached-entry-price-related-to-pending-position-wishes-use-case';
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

jest.mock('../../../../../lib/domain/IdGenerator');

const AN_ID = uuidv4();

const A_POSITION_ID = PositionId.from(AN_ID);

const NASDAQ_AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const NASDAQ_MSFT = SymbolWithExchange.from('NASDAQ:MSFT');
const NASDAQ_GOOGL = SymbolWithExchange.from('NASDAQ:GOOGL');

const NOW = new Date('2020-01-01');

describe('CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase', () => {
  let useCase: CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase;
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
        CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase,
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

    useCase = app.get(
      CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase,
    );
    historicalPriceService = app.get(HistoricalPriceService);
    telegramService = app.get(TelegramService);
    positionWishRepository = app.get('PositionWishRepository');
    ongoingPositionRepository = app.get('OngoingPositionRepository');

    jest.mocked(IdGenerator.generateUUIDv4).mockReturnValue(AN_ID);
  });

  test('given pending position wishes, when entry price has been reached, it should ask confirmation through telegram bot', async () => {
    when(positionWishRepository.getAllPending).mockResolvedValue([
      givenPendingPositionWish({ entryPrice: 100, symbol: NASDAQ_AAPL }),
      givenPendingPositionWish({ entryPrice: 150, symbol: NASDAQ_MSFT }),
      givenPendingPositionWish({ entryPrice: 200, symbol: NASDAQ_GOOGL }),
    ]);

    when(historicalPriceService.getLast15MinHighestPriceFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue(99);
    when(historicalPriceService.getLast15MinHighestPriceFor)
      .calledWith(NASDAQ_MSFT)
      .mockResolvedValue(150);
    when(historicalPriceService.getLast15MinHighestPriceFor)
      .calledWith(NASDAQ_GOOGL)
      .mockResolvedValue(200);

    when(telegramService.validateBuyOrderExecution).mockResolvedValue(101.5);

    await useCase.execute();

    expect(telegramService.validateBuyOrderExecution.mock.calls).toEqual([
      [NASDAQ_MSFT],
      [NASDAQ_GOOGL],
    ]);
  });

  test('given user has confirmed for order execution with buyPrice, then it should set wish to executed, create ongoing position and persist them', async () => {
    const aPendingPositionWish = givenPendingPositionWish({
      entryPrice: 100,
      symbol: NASDAQ_AAPL,
    });
    when(positionWishRepository.getAllPending).mockResolvedValue([
      aPendingPositionWish,
    ]);

    when(historicalPriceService.getLast15MinHighestPriceFor)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue(101);

    when(telegramService.validateBuyOrderExecution)
      .calledWith(NASDAQ_AAPL)
      .mockResolvedValue(101.5);

    await useCase.execute();

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        ...aPendingPositionWish,
        status: PositionWishStatus.EXECUTED,
      }),
    );

    expect(ongoingPositionRepository.save).toHaveBeenCalledWith(
      new OngoingPosition({
        id: A_POSITION_ID,
        userId: aPendingPositionWish.userId,
        symbol: aPendingPositionWish.symbol,
        buyPrice: 101.5,
        stopLoss: aPendingPositionWish.stopLoss,
        quantity: aPendingPositionWish.quantity,
        createdAt: NOW,
      }),
    );
  });
});
