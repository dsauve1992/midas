import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export class PositionModel {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly symbol: SymbolWithExchange,
    readonly quantity: number,
    readonly buyPrice: number,
    readonly stopLoss: number,
    readonly riskPercentage: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
