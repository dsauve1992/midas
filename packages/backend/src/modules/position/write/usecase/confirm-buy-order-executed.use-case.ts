import { Inject, Injectable } from '@nestjs/common';
import { BaseMutationUseCase } from '../../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../../lib/unit-of-work/transactional-unit-of-work.service';
import { PositionId } from '../domain/model/position-id';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { OngoingPositionRepository } from '../domain/repository/ongoing-position.repository';

export type ConfirmBuyOrderCreatedRequest = {
  positionId: PositionId;
  buyPrice: number;
};

@Injectable()
export class ConfirmBuyOrderExecutedUseCase extends BaseMutationUseCase<ConfirmBuyOrderCreatedRequest> {
  constructor(
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
    @Inject('PositionWishRepository')
    private readonly positionWishRepository: PositionWishRepository,
    @Inject('OngoingPositionRepository')
    private readonly ongoingPositionRepository: OngoingPositionRepository,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase(
    request: ConfirmBuyOrderCreatedRequest,
  ): Promise<void> {
    const positionWish = await this.positionWishRepository.getById(
      request.positionId,
    );

    const ongoingPosition = positionWish.confirmBuyOrderExecuted(
      request.buyPrice,
    );

    await this.positionWishRepository.save(positionWish);
    await this.ongoingPositionRepository.save(ongoingPosition);
  }
}
