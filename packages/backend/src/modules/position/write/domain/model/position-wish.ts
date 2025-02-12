import { Percentage } from '../../../../../lib/domain/Percentage';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';

export class PositionWish {
  constructor(
    private readonly id: PositionId,
    private readonly symbol: SymbolWithExchange,
    private readonly buyPrice: number,
    private readonly stopLoss: number,
    private readonly portofolioTotalValue: number,
    private readonly riskPercentage: Percentage,
    private readonly quantity: number,
  ) {}

  static new(
    symbol: SymbolWithExchange,
    buyPrice: number,
    stopLoss: number,
    portofolioTotalValue: number,
    riskPercentage: Percentage,
    quantity: number,
  ) {
    return new PositionWish(
      PositionId.new(),
      symbol,
      buyPrice,
      stopLoss,
      portofolioTotalValue,
      riskPercentage,
      quantity,
    );
  }
}
