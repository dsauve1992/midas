import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('position', (table) => {
    table.string('id').primary();
    table
      .string('position_wish_id')
      .nullable()
      .references('id')
      .inTable('position_wishes');
    table.string('status').notNullable();
    table.string('user_id').notNullable();
    table.string('symbol_with_exchange').notNullable();
    table.integer('nb_shares', 7).notNullable();
    table.decimal('buy_price', 15, 5).notNullable();
    table.decimal('stop_loss', 15, 5).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('symbol_with_exchange');
    table.index('user_id');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('position');
}
