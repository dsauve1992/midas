type BreakoutMetric = {
  name: string;
  value: string | number;
};

export class StockBreakoutEvent {
  static TYPE = 'stock.breakout';

  public date: Date;

  constructor(
    private symbol: string,
    private metrics: BreakoutMetric[],
  ) {
    this.date = new Date();
  }

  toString() {
    return `
    #### ${this.symbol}
    ${this.metrics.map(({ name, value }) => `${name} : ${value}`).join('\n')}
    `;
  }
}
