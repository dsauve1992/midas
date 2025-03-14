import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { UserId } from '../../../../user/domain/UserId';

export class OngoingPosition {
  constructor(
    readonly id: PositionId,
    readonly userId: UserId,
    readonly symbol: SymbolWithExchange,
    readonly buyPrice: number,
    readonly stopLoss: number,
    readonly quantity: number,
    readonly createdAt: Date,
  ) {}
}
