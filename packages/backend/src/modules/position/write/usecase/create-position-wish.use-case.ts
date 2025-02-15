import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../lib/domain/Percentage';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { PositionWish } from '../domain/model/position-wish';
import { Inject, Injectable } from '@nestjs/common';

export type CreatePositionListRequest = {
  userId: string;
  symbol: SymbolWithExchange;
  buyPrice: number;
  stopLoss: number;
  portfolioValue: number;
  riskPercentage: Percentage;
  quantity: number;
};

@Injectable()
export class CreatePositionWishUseCase {
  constructor(
    @Inject('PositionWishRepository')
    private readonly positionWishRepository: PositionWishRepository,
  ) {}

  async execute(request: CreatePositionListRequest): Promise<void> {
    const positionWish = PositionWish.new(
      request.symbol,
      request.buyPrice,
      request.stopLoss,
      request.portfolioValue,
      request.riskPercentage,
      request.quantity,
      request.userId,
    );

    await this.positionWishRepository.save(positionWish);
  }
}
