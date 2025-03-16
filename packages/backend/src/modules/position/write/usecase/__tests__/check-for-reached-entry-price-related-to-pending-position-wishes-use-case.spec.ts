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

jest.mock('../../../../../lib/domain/IdGenerator');

const NASDAQ_AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const NASDAQ_MSFT = SymbolWithExchange.from('NASDAQ:MSFT');
const NASDAQ_GOOGL = SymbolWithExchange.from('NASDAQ:GOOGL');

describe('CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase', () => {
  let useCase: CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;
  let historicalPriceService: DeepMocked<HistoricalPriceService>;
  let telegramService: DeepMocked<TelegramService>;

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

    await useCase.execute();

    expect(telegramService.validateBuyOrderExecution.mock.calls).toEqual([
      [NASDAQ_MSFT.toString()],
      [NASDAQ_GOOGL.toString()],
    ]);
  });
});
