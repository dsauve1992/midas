export class Percentage {
  constructor(private readonly value: number) {
    if (value < 0 || value > 1) {
      throw new Error('input value must be between 0 and 1');
    }
  }

  static from(value: number): Percentage {
    return new Percentage(value / 100);
  }

  valueOf(): number {
    return this.value;
  }
}
