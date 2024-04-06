import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default config;
