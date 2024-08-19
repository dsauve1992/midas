import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
    -- Step 1: Add the new column with a temporary default value
    ALTER TABLE watchlists
    ADD COLUMN "order" INTEGER DEFAULT 0;

    -- Step 2: Set a unique value for the new column for each row
    WITH ranked_watchlists AS (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY id) AS order_value
      FROM watchlists
    )
    UPDATE watchlists
    SET "order" = ranked_watchlists.order_value
    FROM ranked_watchlists
    WHERE watchlists.id = ranked_watchlists.id;

    -- Step 3: Alter the column to make it non-nullable and remove the default
    ALTER TABLE watchlists
    ALTER COLUMN "order" SET NOT NULL,
    ALTER COLUMN "order" DROP DEFAULT;

    -- Step 4: Add the unique constraint
    ALTER TABLE watchlists
    ADD CONSTRAINT unique_user_order UNIQUE (user_id, "order");
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE watchlists
    DROP CONSTRAINT unique_user_order;

    ALTER TABLE watchlists
    DROP COLUMN "order";
  `);
}
