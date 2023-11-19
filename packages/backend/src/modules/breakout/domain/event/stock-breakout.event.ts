export class StockBreakoutEvent {
  static TYPE = 'stock.breakout';

  public date: Date;

  constructor(public symbol: string) {
    this.date = new Date();
  }
}
