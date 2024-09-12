import { PoolClient } from 'pg';

export interface DatabaseClientGetter {
  getClient(): PoolClient;
}
