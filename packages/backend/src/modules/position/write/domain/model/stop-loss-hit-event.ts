export type StopLossHitEventProps = {
  sellingPrice: number;
  timestamp: Date;
};

export class StopLossHitEvent {
  readonly sellingPrice: number;
  readonly timestamp: Date;

  constructor(props: StopLossHitEventProps) {
    this.sellingPrice = props.sellingPrice;
    this.timestamp = props.timestamp;
  }
}
