import { PoolClient } from 'pg';

export interface UnitOfWork {
  getClient(): PoolClient;
}
