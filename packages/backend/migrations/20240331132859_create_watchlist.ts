import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`

create table watchlists
(
    id      uuid constraint watchlists_pk
            primary key,
    name    varchar,
    user_id varchar
);

create index watchlists_user_id_index
    on watchlists (user_id);
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
drop index watchlists_user_id_index;
drop table watchlists;
`);
}
