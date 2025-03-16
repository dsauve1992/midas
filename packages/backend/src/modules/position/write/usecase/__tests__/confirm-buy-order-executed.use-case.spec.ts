import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { IdGenerator } from '../../../../../lib/domain/IdGenerator';
import { v4 as uuidv4 } from 'uuid';
import { PositionId } from '../../domain/model/position-id';
import { ConfirmBuyOrderExecutedUseCase } from '../confirm-buy-order-executed.use-case';
import { OngoingPositionRepository } from '../../domain/repository/ongoing-position.repository';
import {
  givenPendingPositionWish,
  givenPositionWish,
} from '../../domain/model/__tests__/__fixtures__/position-wish.fixture';
import { when } from 'jest-when';
import { OngoingPosition } from '../../domain/model/ongoing-position';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { PositionWishStatus } from '../../domain/model/position-wish-status';
import { PositionWish } from '../../domain/model/position-wish';

jest.mock('../../../../../lib/domain/IdGenerator');

const AN_ID = uuidv4();

const NOW = new Date('2020-01-01');

const A_POSITION_ID = PositionId.from(AN_ID);

describe('ConfirmBuyOrderExecutedUseCase', () => {
  let useCase: ConfirmBuyOrderExecutedUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;
  let ongoingPositionRepository: DeepMocked<OngoingPositionRepository>;

  beforeAll(() => jest.useFakeTimers().setSystemTime(NOW));
  afterAll(() => jest.useRealTimers());

  beforeEach(() => jest.clearAllMocks());

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

  test.each([
    PositionWishStatus.WAIT_FOR_ORDER_CREATED,
    PositionWishStatus.EXECUTED,
    PositionWishStatus.CANCELLED,
    PositionWishStatus.REJECTED,
  ])(
    'given a %s position wish, when confirm buy order on that wish, it should throw an error',
    async (status) => {
      when(positionWishRepository.getById)
        .calledWith(A_POSITION_ID)
        .mockResolvedValue(givenPositionWish({ status }));

      await expect(() =>
        useCase.execute({
          positionId: A_POSITION_ID,
          buyPrice: 100,
        }),
      ).rejects.toThrow(
        'Cannot confirm buy order : position wish must be pending',
      );
    },
  );

  test('given a pending position wish, when confirm buy order on that wish, then it should create an ongoing position and persist it', async () => {
    const A_PENDING_POSITION_WISH = givenPendingPositionWish();

    when(positionWishRepository.getById)
      .calledWith(A_PENDING_POSITION_WISH.id)
      .mockResolvedValue(givenPendingPositionWish());

    const buyPrice = 100;

    await useCase.execute({
      positionId: A_PENDING_POSITION_WISH.id,
      buyPrice,
    });

    expect(ongoingPositionRepository.save).toHaveBeenCalledWith(
      new OngoingPosition(
        PositionId.from(AN_ID),
        A_PENDING_POSITION_WISH.userId,
        A_PENDING_POSITION_WISH.symbol,
        buyPrice,
        A_PENDING_POSITION_WISH.stopLoss,
        A_PENDING_POSITION_WISH.quantity,
        NOW,
      ),
    );
  });

  test('given a pending position wish, when confirm buy order on that wish, then it should set position wish to executed and persist it', async () => {
    const A_PENDING_POSITION_WISH = givenPendingPositionWish();

    when(positionWishRepository.getById)
      .calledWith(A_PENDING_POSITION_WISH.id)
      .mockResolvedValue(A_PENDING_POSITION_WISH);

    const buyPrice = 100;

    await useCase.execute({
      positionId: A_PENDING_POSITION_WISH.id,
      buyPrice,
    });

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        ...A_PENDING_POSITION_WISH,
        status: PositionWishStatus.EXECUTED,
      }),
    );
  });
});
