import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { UserId } from '../../../../user/domain/UserId';
import { StrategyName } from './strategy/strategy-name';

export interface OngoingPositionProps {
  id: PositionId;
  positionWishId?: PositionId;
  userId: UserId;
  symbol: SymbolWithExchange;
  buyPrice: number;
  stopLoss: number;
  quantity: number;
  createdAt: Date;
  strategyName?: StrategyName;
}

export class OngoingPosition {
  readonly id: PositionId;
  readonly positionWishId: PositionId | null;
  readonly userId: UserId;
  readonly symbol: SymbolWithExchange;
  readonly buyPrice: number;
  readonly stopLoss: number;
  readonly quantity: number;
  readonly createdAt: Date;
  readonly strategyName: StrategyName;

  constructor(props: OngoingPositionProps) {
    this.id = props.id;
    this.positionWishId = props.positionWishId;
    this.userId = props.userId;
    this.symbol = props.symbol;
    this.buyPrice = props.buyPrice;
    this.stopLoss = props.stopLoss;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
    this.strategyName = props.strategyName ?? StrategyName.HOLD;
  }
}
