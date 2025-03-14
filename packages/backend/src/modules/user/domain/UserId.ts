export class UserId {
  constructor(private readonly value: string) {}

  static from(value: string): UserId {
    return new UserId(value);
  }

  toString(): string {
    return this.value;
  }
}
