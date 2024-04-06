import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../../../domain/repository/watchlist.repository';
import { Watchlist } from '../../../domain/model/Watchlist';
import { Pool } from 'pg';

@Injectable()
export class WatchlistPostgresDbRepository extends WatchlistRepository {
  constructor(@Inject('PG_CONNECTION_POOL') private pool: Pool) {
    super();
  }

  async getByUserId(userId: string) {
    const client = await this.pool.connect();

    try {
      const { rows } = await client.query(
        `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
        watchlist_items.symbol as symbol
        FROM watchlists 
        LEFT JOIN watchlist_items on watchlists.id = watchlist_items.watchlist_id 
        WHERE user_id = '${userId}'
        `,
      );

      if (rows.length === 0) {
        return Watchlist.init(userId);
      }

      return new Watchlist(
        rows[0].id,
        rows[0].userid,
        new Set(rows.map((row) => row.symbol).filter(Boolean)),
      );
    } finally {
      client.release();
    }
  }

  async save(watchlist: Watchlist) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO watchlists (id, name, user_id) VALUES ('${watchlist.id}', 'default', '${watchlist.userId}') ON CONFLICT DO NOTHING`,
      );

      await client.query(
        `DELETE FROM watchlist_items WHERE watchlist_id = '${watchlist.id}'`,
      );

      if (!watchlist.isEmpty()) {
        await client.query(
          `INSERT INTO watchlist_items (symbol, watchlist_id) VALUES
                                                       ${Array.from(
                                                         watchlist,
                                                       ).map(
                                                         (item) =>
                                                           `('${item}', '${watchlist.id}')`,
                                                       )}
                                                       `,
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
