import { PositionEvent, PositionEventId } from './position-event';

export type StopLossHitEventProps = {
  id: PositionEventId;
  sellingPrice: number;
  timestamp: Date;
};

export class StopLossHitEvent extends PositionEvent {
  readonly sellingPrice: number;

  constructor(props: StopLossHitEventProps) {
    super(props.id, props.timestamp);
    this.sellingPrice = props.sellingPrice;
  }

  static new(sellingPrice: number) {
    return new StopLossHitEvent({
      id: PositionEventId.new(),
      sellingPrice,
      timestamp: new Date(),
    });
  }
}
