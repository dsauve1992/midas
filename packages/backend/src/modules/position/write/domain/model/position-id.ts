import { IdGenerator } from '../../../../../lib/domain/IdGenerator';

export class PositionId {
  constructor(private readonly value: string) {}

  static new(): PositionId {
    return new PositionId(IdGenerator.generateUUIDv4());
  }

  static from(value: string): PositionId {
    return new PositionId(value);
  }

  toString(): string {
    return this.value;
  }
}
