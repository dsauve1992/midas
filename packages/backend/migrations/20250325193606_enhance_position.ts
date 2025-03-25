import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('position', (table) => {
      table.string('strategy').nullable();
    })
    .createTable('position_events', (table) => {
      table.string('id').primary();
      table
        .string('position_id')
        .notNullable()
        .references('id')
        .inTable('position');
      table.string('event_type').notNullable();
      table.jsonb('payload').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('position', (table) => {
      table.dropColumn('strategy');
    })
    .dropTable('position_events');
}
