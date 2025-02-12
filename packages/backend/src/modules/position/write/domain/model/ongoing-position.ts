import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { PositionId } from './position-id';

export class OngoingPositionEvent {
  constructor(
    readonly type: 'CLOSED' | 'TAKE_PROFIT' | 'RAISE_STOP_LOSS',
    readonly timestamp: Date,
    readonly payload: any,
  ) {}

  static Closed(payload: any) {
    return new OngoingPositionEvent('CLOSED', new Date(), payload);
  }

  static TakeProfit(payload: any) {
    return new OngoingPositionEvent('TAKE_PROFIT', new Date(), payload);
  }

  static RaiseStopLoss(payload: any): OngoingPositionEvent {
    return new OngoingPositionEvent('RAISE_STOP_LOSS', new Date(), payload);
  }
}

export class OngoingPosition {
  private _history: OngoingPositionEvent[] = [];

  constructor(
    readonly id: PositionId,
    readonly symbol: SymbolWithExchange,
    readonly buyPrice: number,
    readonly stopLoss: number,
    readonly quantity: number,
  ) {}

  get history(): OngoingPositionEvent[] {
    return this._history;
  }

  get initialRiskPerShare(): number {
    return this.buyPrice - this.stopLoss;
  }

  get lastEvent(): OngoingPositionEvent {
    return this._history[this._history.length - 1];
  }

  isClosed(): boolean {
    const lastEvent = this.lastEvent;

    return lastEvent.type === 'CLOSED';
  }

  async check(currentPrice: number): Promise<void> {
    if (currentPrice < this.stopLoss) {
      this._history.push(
        OngoingPositionEvent.Closed({
          currentPrice,
          stopLoss: this.stopLoss,
        }),
      );
    } else if (currentPrice >= 2 * this.initialRiskPerShare) {
      const quantityToSell = Math.ceil(this.quantity / 3);
      this._history.push(
        OngoingPositionEvent.TakeProfit({
          preliminarySellPrice: currentPrice,
          quantity: quantityToSell,
        }),
      );
      this._history.push(
        OngoingPositionEvent.RaiseStopLoss({ newStopLoss: this.buyPrice }),
      );
    }
  }
}
