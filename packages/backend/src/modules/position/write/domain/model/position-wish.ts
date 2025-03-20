import { Percentage } from '../../../../../lib/domain/Percentage';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { OngoingPosition } from './ongoing-position';
import { UserId } from '../../../../user/domain/UserId';
import { PositionWishStatus } from './position-wish-status';

export interface PositionWishProps {
  id: PositionId;
  userId: UserId;
  symbol: SymbolWithExchange;
  status: PositionWishStatus;
  entryPrice: number;
  stopLoss: number;
  riskPercentage: Percentage;
  quantity: number;
  createdAt: Date;
}

export class PositionWish {
  readonly id: PositionId;
  private _status: PositionWishStatus;
  readonly userId: UserId;
  readonly symbol: SymbolWithExchange;
  readonly entryPrice: number;
  readonly stopLoss: number;
  readonly riskPercentage: Percentage;
  readonly quantity: number;
  readonly createdAt: Date;

  constructor(props: PositionWishProps) {
    this.id = props.id;
    this.userId = props.userId;
    this._status = props.status;
    this.symbol = props.symbol;
    this.entryPrice = props.entryPrice;
    this.stopLoss = props.stopLoss;
    this.riskPercentage = props.riskPercentage;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
  }

  get status(): PositionWishStatus {
    return this._status;
  }

  static new(
    userId: UserId,
    symbol: SymbolWithExchange,
    entryPrice: number,
    stopLoss: number,
    riskPercentage: Percentage,
    quantity: number,
  ): PositionWish {
    return new PositionWish({
      id: PositionId.new(),
      status: PositionWishStatus.WAIT_FOR_ORDER_CREATED,
      userId,
      symbol,
      entryPrice,
      stopLoss,
      riskPercentage,
      quantity,
      createdAt: new Date(),
    });
  }

  confirmBuyOrderExecuted(buyPrice: number): OngoingPosition {
    if (this.status !== PositionWishStatus.PENDING) {
      throw new Error(
        'Cannot confirm buy order execution: position wish must be pending',
      );
    }

    this._status = PositionWishStatus.EXECUTED;

    return new OngoingPosition({
      id: PositionId.new(),
      positionWishId: this.id,
      userId: this.userId,
      symbol: this.symbol,
      buyPrice: buyPrice,
      stopLoss: this.stopLoss,
      quantity: this.quantity,
      createdAt: new Date(),
    });
  }

  confirmBuyOrderCreated() {
    if (this.status !== PositionWishStatus.WAIT_FOR_ORDER_CREATED) {
      throw new Error(
        'Cannot confirm buy order creation : position wish must be waiting for order to be created',
      );
    }

    this._status = PositionWishStatus.PENDING;
  }

  setStopLossHit() {
    this._status = PositionWishStatus.STOP_LOSS_HIT;
  }
}
