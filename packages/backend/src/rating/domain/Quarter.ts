export class Quarter {
  constructor(
    public readonly quarterNumber: number,
    public readonly year: number,
  ) {}

  isEqual(quarter: Quarter): boolean {
    return this.compare(quarter) === 0;
  }

  toString(): string {
    return `Q${this.quarterNumber} - ${this.year}`;
  }

  isSameQuarterOneYearBefore(quarter: Quarter): boolean {
    return (
      this.year === quarter.year + 1 &&
      this.quarterNumber === quarter.quarterNumber
    );
  }

  sameQuarterOneYearBefore(): Quarter {
    return new Quarter(this.quarterNumber, this.year - 1);
  }

  compare(quarter: Quarter): number {
    if (this.year < quarter.year) {
      return -1;
    } else if (this.year > quarter.year) {
      return 1;
    }

    if (this.quarterNumber < quarter.quarterNumber) {
      return -1;
    } else if (this.quarterNumber > quarter.quarterNumber) {
      return 1;
    }

    return 0;
  }
}
