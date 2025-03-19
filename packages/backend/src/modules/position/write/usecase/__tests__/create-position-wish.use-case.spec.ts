import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePositionWishUseCase } from '../create-position-wish.use-case';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { Percentage } from '../../../../../lib/domain/Percentage';
import { PositionWish } from '../../domain/model/position-wish';
import { IdGenerator } from '../../../../../lib/domain/IdGenerator';
import { v4 as uuidv4 } from 'uuid';
import { PositionId } from '../../domain/model/position-id';
import { UserId } from '../../../../user/domain/UserId';
import { PositionWishStatus } from '../../domain/model/position-wish-status';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';

jest.mock('../../../../../lib/domain/IdGenerator');

const AAPL = SymbolWithExchange.from('NASDAQ:AAPL');
const A_USER_ID = UserId.from('1');

const AN_ID = uuidv4();

const NOW = new Date('2020-01-01');

describe('CreatePositionWishUseCase', () => {
  let useCase: CreatePositionWishUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;

  beforeAll(() => jest.useFakeTimers().setSystemTime(NOW));
  afterAll(() => jest.useRealTimers());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        CreatePositionWishUseCase,
        {
          provide: 'PositionWishRepository',
          useValue: createMock<PositionWishRepository>(),
        },
      ],
    }).compile();

    useCase = app.get(CreatePositionWishUseCase);
    positionWishRepository = app.get('PositionWishRepository');

    jest.mocked(IdGenerator.generateUUIDv4).mockReturnValue(AN_ID);
  });

  test('when create a position wish, it should wait for order to be created and persist it', async () => {
    await useCase.execute({
      symbol: AAPL,
      entryPrice: 100,
      stopLoss: 90,
      riskPercentage: Percentage.from(0.005),
      quantity: 10,
      userId: A_USER_ID,
    });

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        id: PositionId.from(AN_ID),
        status: PositionWishStatus.WAIT_FOR_ORDER_CREATED,
        userId: A_USER_ID,
        symbol: AAPL,
        entryPrice: 100,
        stopLoss: 90,
        riskPercentage: Percentage.from(0.005),
        quantity: 10,
        createdAt: NOW,
      }),
    );
  });
});
