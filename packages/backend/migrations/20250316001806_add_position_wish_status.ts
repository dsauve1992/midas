import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('position_wishes', (table) => {
    table.string('status').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('position_wishes', (table) => {
    table.dropColumn('status');
  });
}
