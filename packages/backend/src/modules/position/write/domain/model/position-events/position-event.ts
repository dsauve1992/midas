import { IdGenerator } from '../../../../../../lib/domain/IdGenerator';

export abstract class PositionEvent {
  readonly id: PositionEventId;
  readonly timestamp: Date;

  protected constructor(id: PositionEventId, timestamp: Date) {
    this.id = id;
    this.timestamp = timestamp;
  }
}

export class PositionEventId {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static new(): PositionEventId {
    return new PositionEventId(IdGenerator.generateUUIDv4());
  }

  static from(value: string): PositionEventId {
    return new PositionEventId(value);
  }

  toString(): string {
    return this.value;
  }
}
