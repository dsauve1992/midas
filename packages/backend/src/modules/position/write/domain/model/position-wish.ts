import { Percentage } from '../../../../../lib/domain/Percentage';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';

export class PositionWish {
  constructor(
    readonly id: PositionId,
    readonly userId: string,
    readonly symbol: SymbolWithExchange,
    readonly buyPrice: number,
    readonly stopLoss: number,
    readonly riskPercentage: Percentage,
    readonly quantity: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static new(
    userId: string,
    symbol: SymbolWithExchange,
    buyPrice: number,
    stopLoss: number,
    riskPercentage: Percentage,
    quantity: number,
  ) {
    return new PositionWish(
      PositionId.new(),
      userId,
      symbol,
      buyPrice,
      stopLoss,
      riskPercentage,
      quantity,
      new Date(),
      new Date(),
    );
  }
}
