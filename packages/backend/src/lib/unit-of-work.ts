import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class UnitOfWork {
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
      this.client.release();
      this.client = null; // Ensure client is cleared after release
    }
  }

  getClient(): PoolClient {
    if (!this.client) {
      throw new Error('No active transaction. Did you forget to call start()?');
    }
    return this.client;
  }
}
