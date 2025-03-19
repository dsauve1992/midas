import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { RemindToCreateBuyOrderUseCase } from '../remind-to-create-buy-order-use-case';
import { TelegramService } from '../../../../telegram/telegram.service';
import { when } from 'jest-when';
import { givenWaitForOrderCreatedPositionWish } from '../../domain/model/__tests__/__fixtures__/position-wish.fixture';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionWish } from '../../domain/model/position-wish';
import { PositionWishStatus } from '../../domain/model/position-wish-status';

const NASDAQ_AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const NASDAQ_MSFT = SymbolWithExchange.from('NASDAQ:MSFT');

describe('RemindToCreateBuyOrderUseCase', () => {
  let useCase: RemindToCreateBuyOrderUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;
  let telegramService: DeepMocked<TelegramService>;

  beforeEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        RemindToCreateBuyOrderUseCase,
        {
          provide: 'PositionWishRepository',
          useValue: createMock<PositionWishRepository>(),
        },
        {
          provide: TelegramService,
          useValue: createMock<TelegramService>(),
        },
      ],
    }).compile();

    useCase = app.get(RemindToCreateBuyOrderUseCase);
    positionWishRepository = app.get('PositionWishRepository');
    telegramService = app.get(TelegramService);
  });

  test('given wait for order to be created position wishes, when remind to create buy order, it should remind user througth telegram for each wishes', async () => {
    when(positionWishRepository.getAllWaitingForOrderCreated).mockResolvedValue(
      [
        givenWaitForOrderCreatedPositionWish({
          symbol: NASDAQ_AAPL,
          quantity: 10,
          entryPrice: 100,
        }),
        givenWaitForOrderCreatedPositionWish({
          symbol: NASDAQ_MSFT,
          quantity: 11,
          entryPrice: 76,
        }),
      ],
    );

    when(telegramService.remindBuyOrder).mockResolvedValue(false);

    await useCase.execute();

    expect(telegramService.remindBuyOrder.mock.calls).toEqual([
      [NASDAQ_AAPL, 10, 100],
      [NASDAQ_MSFT, 11, 76],
    ]);
  });

  test('given a wait for order to be created position wish, when user confirm that buy order has been created, it should set position to pending and persist it', async () => {
    const aWaitForOrderCreatedPositionWish =
      givenWaitForOrderCreatedPositionWish({
        symbol: NASDAQ_AAPL,
        quantity: 10,
        entryPrice: 100,
      });

    when(positionWishRepository.getAllWaitingForOrderCreated).mockResolvedValue(
      [aWaitForOrderCreatedPositionWish],
    );

    when(telegramService.remindBuyOrder)
      .calledWith(NASDAQ_AAPL, 10, 100)
      .mockResolvedValue(true);

    await useCase.execute();

    expect(positionWishRepository.save).toHaveBeenNthCalledWith(
      1,
      new PositionWish({
        ...aWaitForOrderCreatedPositionWish,
        status: PositionWishStatus.PENDING,
      }),
    );
  });

  test('given a wait for order to be created position wish, when user refute that buy order has been created, it should do nothing', async () => {
    const aWaitForOrderCreatedPositionWish =
      givenWaitForOrderCreatedPositionWish({
        symbol: NASDAQ_AAPL,
        quantity: 10,
        entryPrice: 100,
      });

    when(positionWishRepository.getAllWaitingForOrderCreated).mockResolvedValue(
      [aWaitForOrderCreatedPositionWish],
    );

    when(telegramService.remindBuyOrder)
      .calledWith(NASDAQ_AAPL, 10, 100)
      .mockResolvedValue(false);

    await useCase.execute();

    expect(positionWishRepository.save).not.toHaveBeenCalled();
  });
});
