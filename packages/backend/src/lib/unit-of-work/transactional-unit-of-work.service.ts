import { Inject } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { UnitOfWork } from './unit-of-work';

export class TransactionalUnitOfWork implements UnitOfWork {
  private client: PoolClient;

  constructor(@Inject('PG_CONNECTION_POOL') private readonly pool: Pool) {}

  async start() {
    this.client = await this.pool.connect();
    await this.client.query('BEGIN');
  }

  async commit() {
    try {
      await this.client.query('COMMIT');
    } finally {
      this.client.release();
      this.client = null; // Ensure client is cleared after release
    }
  }

  async rollback() {
    try {
      await this.client.query('ROLLBACK');
    } finally {
      if (this.client) {
        this.client.release();
        this.client = null; // Ensure client is cleared after release
      }
    }
  }

  getClient(): PoolClient {
    if (!this.client) {
      throw new Error('No active transaction. Did you forget to call start()?');
    }
    return this.client;
  }
}
