import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';
import { Percentage } from '../../../../lib/domain/Percentage';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { PositionWish } from '../domain/model/position-wish';
import { Injectable } from '@nestjs/common';

export type CreatePositionListRequest = {
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
    );

    await this.positionWishRepository.save(positionWish);
  }
}
