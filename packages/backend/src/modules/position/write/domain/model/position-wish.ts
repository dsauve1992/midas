import { Percentage } from '../../../../../lib/domain/Percentage';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { OngoingPosition } from './ongoing-position';
import { UserId } from '../../../../user/domain/UserId';

export class PositionWish {
  constructor(
    readonly id: PositionId,
    readonly userId: UserId,
    readonly symbol: SymbolWithExchange,
    readonly entryPrice: number,
    readonly stopLoss: number,
    readonly riskPercentage: Percentage,
    readonly quantity: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static new(
    userId: UserId,
    symbol: SymbolWithExchange,
    entryPrice: number,
    stopLoss: number,
    riskPercentage: Percentage,
    quantity: number,
  ) {
    return new PositionWish(
      PositionId.new(),
      userId,
      symbol,
      entryPrice,
      stopLoss,
      riskPercentage,
      quantity,
      new Date(),
      new Date(),
    );
  }

  confirmBuyOrderExecuted(buyPrice: number) {
    return new OngoingPosition(
      PositionId.new(),
      this.userId,
      this.symbol,
      buyPrice,
      this.stopLoss,
      this.quantity,
      new Date(),
    );
  }
}
