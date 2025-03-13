import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../lib/domain/Percentage';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { PositionWish } from '../domain/model/position-wish';
import { Inject, Injectable } from '@nestjs/common';
import { BaseMutationUseCase } from '../../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../../lib/unit-of-work/transactional-unit-of-work.service';

export type CreatePositionWishRequest = {
  userId: string;
  symbol: SymbolWithExchange;
  entryPrice: number;
  stopLoss: number;
  riskPercentage: Percentage;
  quantity: number;
};

@Injectable()
export class CreatePositionWishUseCase extends BaseMutationUseCase<
  CreatePositionWishRequest,
  PositionWish
> {
  constructor(
    @Inject('PositionWishRepository')
    private readonly positionWishRepository: PositionWishRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase(
    request: CreatePositionWishRequest,
  ): Promise<PositionWish> {
    const positionWish = PositionWish.new(
      request.userId,
      request.symbol,
      request.entryPrice,
      request.stopLoss,
      request.riskPercentage,
      request.quantity,
    );

    await this.positionWishRepository.save(positionWish);

    return positionWish;
  }
}
