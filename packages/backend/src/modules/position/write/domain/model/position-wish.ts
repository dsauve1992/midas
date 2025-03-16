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
  updatedAt: Date;
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
  readonly updatedAt: Date;

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
    this.updatedAt = props.updatedAt;
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
      status: PositionWishStatus.PENDING,
      userId,
      symbol,
      entryPrice,
      stopLoss,
      riskPercentage,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  confirmBuyOrderExecuted(buyPrice: number): OngoingPosition {
    this._status = PositionWishStatus.EXECUTED;

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
