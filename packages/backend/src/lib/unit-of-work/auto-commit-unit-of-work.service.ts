import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { UnitOfWork } from './unit-of-work';

@Injectable()
export class AutoCommitUnitOfWork implements UnitOfWork {
  private client: PoolClient;

  constructor(@Inject('PG_CONNECTION_POOL') private readonly pool: Pool) {}

  async connect() {
    this.client = await this.pool.connect();
  }

  async release() {
    this.client.release();
    this.client = null; // Ensure client is cleared after release
  }

  getClient(): PoolClient {
    if (!this.client) {
      throw new Error(
        'No active transaction. Did you forget to call connect()?',
      );
    }
    return this.client;
  }
}