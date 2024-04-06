import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
create table watchlist_items
(
    symbol       varchar not null,
    watchlist_id uuid
        constraint watchlist_items_watchlists_id_fk
            references watchlists,
    constraint watchlist_items_pk
        primary key (watchlist_id, symbol)
);
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
drop table watchlist_items
    `);
}
