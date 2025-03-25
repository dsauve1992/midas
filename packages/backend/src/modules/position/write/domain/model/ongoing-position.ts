import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';
import { UserId } from '../../../../user/domain/UserId';
import { StrategyName } from './strategy/strategy-name';
import { PositionStatus } from './position-status';
import { StopLossHitEvent } from './position-events/stop-loss-hit-event';
import { TakePartialProfitEvent } from './position-events/take-partial-profit-event';

export interface OngoingPositionProps {
  id: PositionId;
  positionWishId?: PositionId;
  userId: UserId;
  status: PositionStatus;
  symbol: SymbolWithExchange;
  buyPrice: number;
  stopLoss: number;
  quantity: number;
  createdAt: Date;
  strategyName?: StrategyName;
  events: StopLossHitEvent[];
}

export interface NewOngoingPositionProps {
  positionWishId?: PositionId;
  userId: UserId;
  symbol: SymbolWithExchange;
  buyPrice: number;
  stopLoss: number;
  quantity: number;
}

export class OngoingPosition {
  readonly id: PositionId;
  readonly positionWishId: PositionId | null;
  readonly userId: UserId;
  private _status: PositionStatus;
  readonly symbol: SymbolWithExchange;
  readonly buyPrice: number;
  readonly stopLoss: number;
  readonly quantity: number;
  readonly createdAt: Date;
  readonly strategyName: StrategyName;
  readonly events: (StopLossHitEvent | TakePartialProfitEvent)[];

  constructor(props: OngoingPositionProps) {
    this.id = props.id;
    this.positionWishId = props.positionWishId;
    this._status = props.status;
    this.userId = props.userId;
    this.symbol = props.symbol;
    this.buyPrice = props.buyPrice;
    this.stopLoss = props.stopLoss;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
    this.strategyName = props.strategyName ?? StrategyName.RISK_REWARD_RATIO;
    this.events = props.events;
  }

  static new(props: NewOngoingPositionProps) {
    return new OngoingPosition({
      id: PositionId.new(),
      positionWishId: props.positionWishId ?? null,
      userId: props.userId,
      status: PositionStatus.ONGOING,
      symbol: props.symbol,
      buyPrice: props.buyPrice,
      stopLoss: props.stopLoss,
      quantity: props.quantity,
      createdAt: new Date(),
      events: [],
    });
  }

  get status(): PositionStatus {
    return this._status;
  }

  registerStopLossHit(sellingPrice: number) {
    this.events.push(StopLossHitEvent.new(sellingPrice));
    this._status = PositionStatus.COMPLETED;
  }

  computeR(factor: number) {
    return this.buyPrice + (this.buyPrice - this.stopLoss) * factor;
  }

  registerPartialTakeProfit(sellingPrice: number, quantity: number) {
    this.events.push(TakePartialProfitEvent.new(sellingPrice, quantity));
  }
}
