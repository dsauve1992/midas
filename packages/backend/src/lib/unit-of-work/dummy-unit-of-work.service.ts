import { Injectable } from '@nestjs/common';
import { UnitOfWork } from './unit-of-work';

@Injectable()
export class DummyUnitOfWork implements UnitOfWork {
  async start(): Promise<void> {}

  async commit(): Promise<void> {}

  async rollback(): Promise<void> {}
}
