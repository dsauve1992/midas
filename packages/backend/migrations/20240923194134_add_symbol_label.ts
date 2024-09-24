import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`

create table symbol_label
(
    symbol      varchar,
    title       varchar,
    description varchar
);

`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
drop table symbol_label;
`);
}
