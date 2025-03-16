import { Inject, Injectable } from '@nestjs/common';
import { BaseMutationUseCase } from '../../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../../lib/unit-of-work/transactional-unit-of-work.service';
import { PositionId } from '../domain/model/position-id';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { PositionWishStatus } from '../domain/model/position-wish-status';

export type ConfirmBuyOrderCreatedRequest = {
  positionId: PositionId;
};

@Injectable()
export class ConfirmBuyOrderCreatedUseCase extends BaseMutationUseCase<ConfirmBuyOrderCreatedRequest> {
  constructor(
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
    @Inject('PositionWishRepository')
    private readonly positionWishRepository: PositionWishRepository,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase(
    request: ConfirmBuyOrderCreatedRequest,
  ): Promise<void> {
    const positionWish = await this.positionWishRepository.getById(
      request.positionId,
    );

    if (positionWish.status !== PositionWishStatus.WAIT_FOR_ORDER_CREATED) {
      throw new Error(
        'Cannot confirm buy order creation : position wish must be waiting for order to be created',
      );
    }

    positionWish.confirmBuyOrderCreated();

    await this.positionWishRepository.save(positionWish);
  }
}
