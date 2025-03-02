// src/infrastructure/database/migrations/20250301_create_position_wishes_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('position_wishes', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable();
    table.string('symbol_with_exchange').notNullable();
    table.integer('nb_shares', 7).notNullable();
    table.decimal('risk_percentage', 15, 5).notNullable();
    table.decimal('target_buy_price', 15, 5).notNullable();
    table.decimal('stop_loss', 15, 5).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('symbol_with_exchange');
    table.index('user_id');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('position_wishes');
}
