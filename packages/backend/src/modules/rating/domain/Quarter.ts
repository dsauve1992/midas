export class Quarter {
  constructor(
    public readonly quarterNumber: number,
    public readonly year: number,
  ) {}

  isEqual(quarter: Quarter): boolean {
    return this.valueOf() === quarter.valueOf();
  }

  toString(): string {
    return `Q${this.quarterNumber} - ${this.year}`;
  }

  valueOf(): number {
    return this.year + this.quarterNumber / 10;
  }

  previousQuarter(): Quarter {
    if (this.quarterNumber === 1) {
      return new Quarter(4, this.year - 1);
    }

    return new Quarter(this.quarterNumber - 1, this.year);
  }

  nextQuarter(): Quarter {
    if (this.quarterNumber === 4) {
      return new Quarter(1, this.year + 1);
    }

    return new Quarter(this.quarterNumber + 1, this.year);
  }

  sameQuarterOneYearBefore(): Quarter {
    return new Quarter(this.quarterNumber, this.year - 1);
  }

  compare(quarter: Quarter): number {
    if (this.valueOf() < quarter.valueOf()) {
      return -1;
    } else if (this.valueOf() > quarter.valueOf()) {
      return 1;
    }

    return 0;
  }
}
