export class Growth {
  constructor(
    private current: number,
    private previous: number,
  ) {}

  getPercentage(): number {
    return ((this.current - this.previous) / Math.abs(this.previous)) * 100;
  }

  toString(): string {
    return `${this.getPercentage().toFixed(2)}%`;
  }
}
