import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { IdGenerator } from '../../../../../lib/domain/IdGenerator';
import { v4 as uuidv4 } from 'uuid';
import { PositionId } from '../../domain/model/position-id';
import { ConfirmBuyOrderExecutedUseCase } from '../confirm-buy-order-executed.use-case';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import { givenPositionWish } from '../../domain/model/__tests__/__fixtures__/position-wish.fixture';
import { when } from 'jest-when';
import { OngoingPosition } from '../../domain/model/ongoing-position';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';

jest.mock('../../../../../lib/domain/IdGenerator');

const AN_ID = uuidv4();

const NOW = new Date('2020-01-01');

const A_POSITION_WISH = givenPositionWish();

describe('ConfirmBuyOrderExecutedUseCase', () => {
  let useCase: ConfirmBuyOrderExecutedUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;
  let ongoingPositionRepository: DeepMocked<OngoingPositionRepository>;

  beforeAll(() => jest.useFakeTimers().setSystemTime(NOW));
  afterAll(() => jest.useRealTimers());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        ConfirmBuyOrderExecutedUseCase,
        {
          provide: 'PositionWishRepository',
          useValue: createMock<PositionWishRepository>(),
        },
        {
          provide: 'OngoingPositionRepository',
          useValue: createMock<OngoingPositionRepository>(),
        },
      ],
    }).compile();

    useCase = app.get(ConfirmBuyOrderExecutedUseCase);
    positionWishRepository = app.get('PositionWishRepository');
    ongoingPositionRepository = app.get('OngoingPositionRepository');

    jest.mocked(IdGenerator.generateUUIDv4).mockReturnValue(AN_ID);
  });

  test('given a position wish, when confirm buy order on that wish, it should create an ongoing position and persist it', async () => {
    when(positionWishRepository.getById)
      .calledWith(A_POSITION_WISH.id)
      .mockResolvedValue(A_POSITION_WISH);

    const buyPrice = 100;

    await useCase.execute({
      positionId: A_POSITION_WISH.id,
      buyPrice,
    });

    expect(ongoingPositionRepository.save).toHaveBeenCalledWith(
      new OngoingPosition(
        PositionId.from(AN_ID),
        A_POSITION_WISH.userId,
        A_POSITION_WISH.symbol,
        buyPrice,
        A_POSITION_WISH.stopLoss,
        A_POSITION_WISH.quantity,
        NOW,
      ),
    );
  });
});
