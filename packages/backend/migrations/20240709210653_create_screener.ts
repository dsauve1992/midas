import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`

create table screener
(
    symbol                       varchar not null
        constraint screener_pk
                primary key,
    exchange                     varchar,
    sector                       varchar,
    industry                     varchar,
    rs_line                      real,
    rs_line_sma50                real,
    rs_line_sma200               real,
    fundamental_rating           real,
    average_daily_range          real,
    number_of_days_until_next_earning_call real,
    days_since_last_52_week_high real
);
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
drop table screener;
`);
}
