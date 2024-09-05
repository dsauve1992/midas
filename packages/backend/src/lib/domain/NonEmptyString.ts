export class NonEmptyString {
  private constructor(private readonly value: string) {}

  static from(value: string): NonEmptyString {
    if (value.trim().length === 0) {
      throw new Error('String must not be empty');
    }

    return new NonEmptyString(value);
  }

  toString(): string {
    return this.value;
  }
}
