import { PositionEvent, PositionEventId } from './position-event';

export type TakePartialProfitEventProps = {
  id: PositionEventId;
  sellingPrice: number;
  nbOfShares: number;
  timestamp: Date;
};

export class TakePartialProfitEvent extends PositionEvent {
  readonly sellingPrice: number;
  readonly nbOfShares: number;
  readonly timestamp: Date;

  constructor(props: TakePartialProfitEventProps) {
    super(props.id, props.timestamp);
    this.sellingPrice = props.sellingPrice;
    this.nbOfShares = props.nbOfShares;
  }

  static new(sellingPrice: number, nbOfShares: number) {
    return new TakePartialProfitEvent({
      id: PositionEventId.new(),
      sellingPrice,
      nbOfShares,
      timestamp: new Date(),
    });
  }
}
