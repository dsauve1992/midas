export type TakePartialProfitEventProps = {
  sellingPrice: number;
  nbOfShares: number;
  timestamp: Date;
};

export class TakePartialProfitEvent {
  readonly sellingPrice: number;
  readonly nbOfShares: number;
  readonly timestamp: Date;

  constructor(props: TakePartialProfitEventProps) {
    this.sellingPrice = props.sellingPrice;
    this.nbOfShares = props.nbOfShares;
    this.timestamp = props.timestamp;
  }
}
