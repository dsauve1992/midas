import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionWishRepository } from '../../domain/repository/position-wish.repository';
import { PositionId } from '../../domain/model/position-id';
import {
  givenPositionWish,
  givenWaitForOrderCreatedPositionWish,
} from '../../domain/model/__tests__/__fixtures__/position-wish.fixture';
import { when } from 'jest-when';
import { UseCaseTestModule } from '../../../../../lib/test/use-case/use-case-test.module';
import { PositionWishStatus } from '../../domain/model/position-wish-status';
import { PositionWish } from '../../domain/model/position-wish';
import { ConfirmBuyOrderCreatedUseCase } from '../confirm-buy-order-created.use-case';

jest.mock('../../../../../lib/domain/IdGenerator');

const A_POSITION_ID = PositionId.new();

describe('ConfirmBuyOrderCreatedUseCase', () => {
  let useCase: ConfirmBuyOrderCreatedUseCase;
  let positionWishRepository: DeepMocked<PositionWishRepository>;

  beforeEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UseCaseTestModule],
      providers: [
        ConfirmBuyOrderCreatedUseCase,
        {
          provide: 'PositionWishRepository',
          useValue: createMock<PositionWishRepository>(),
        },
      ],
    }).compile();

    useCase = app.get(ConfirmBuyOrderCreatedUseCase);
    positionWishRepository = app.get('PositionWishRepository');
  });

  test.each([
    PositionWishStatus.PENDING,
    PositionWishStatus.EXECUTED,
    PositionWishStatus.CANCELLED,
    PositionWishStatus.REJECTED,
  ])(
    'given a %s position wish, when confirm buy order created on that wish, it should throw an error',
    async (status) => {
      when(positionWishRepository.getById)
        .calledWith(A_POSITION_ID)
        .mockResolvedValue(givenPositionWish({ status }));

      await expect(() =>
        useCase.execute({ positionId: A_POSITION_ID }),
      ).rejects.toThrow(
        'Cannot confirm buy order creation : position wish must be waiting for order to be created',
      );
    },
  );

  test('given a wait for order created position wish, when confirm buy order creation on that wish, then it should set position wish to pending and persist it', async () => {
    const waitForOrderCreatedPositionWish =
      givenWaitForOrderCreatedPositionWish();

    when(positionWishRepository.getById)
      .calledWith(waitForOrderCreatedPositionWish.id)
      .mockResolvedValue(waitForOrderCreatedPositionWish);

    await useCase.execute({ positionId: waitForOrderCreatedPositionWish.id });

    expect(positionWishRepository.save).toHaveBeenCalledWith(
      new PositionWish({
        ...waitForOrderCreatedPositionWish,
        status: PositionWishStatus.PENDING,
      }),
    );
  });
});
