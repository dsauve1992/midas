import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { UserId } from '../../../../user/domain/UserId';

export interface OngoingPositionProps {
  id: PositionId;
  userId: UserId;
  symbol: SymbolWithExchange;
  buyPrice: number;
  stopLoss: number;
  quantity: number;
  createdAt: Date;
}

export class OngoingPosition {
  readonly id: PositionId;
  readonly userId: UserId;
  readonly symbol: SymbolWithExchange;
  readonly buyPrice: number;
  readonly stopLoss: number;
  readonly quantity: number;
  readonly createdAt: Date;

  constructor(props: OngoingPositionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.symbol = props.symbol;
    this.buyPrice = props.buyPrice;
    this.stopLoss = props.stopLoss;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
  }
}
