import { Percentage } from '../../../../../lib/domain/Percentage';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';

export class PositionWish {
  constructor(
    readonly id: PositionId,
    readonly symbol: SymbolWithExchange,
    readonly buyPrice: number,
    readonly stopLoss: number,
    readonly portfolioTotalValue: number,
    readonly riskPercentage: Percentage,
    readonly quantity: number,
    readonly userId: string,
    readonly createdAt: Date,
  ) {}

  static new(
    symbol: SymbolWithExchange,
    buyPrice: number,
    stopLoss: number,
    portofolioTotalValue: number,
    riskPercentage: Percentage,
    quantity: number,
    userId: string,
  ) {
    return new PositionWish(
      PositionId.new(),
      symbol,
      buyPrice,
      stopLoss,
      portofolioTotalValue,
      riskPercentage,
      quantity,
      userId,
      new Date(),
    );
  }
}
