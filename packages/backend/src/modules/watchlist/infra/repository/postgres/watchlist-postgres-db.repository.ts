import { Inject, Injectable } from '@nestjs/common';
import {
  WatchlistReadOnlyRepository,
  WatchlistWriteRepository,
} from '../../../domain/repository/watchlist.repository';
import { Watchlist } from '../../../domain/model/watchlist';
import { groupBy, values } from 'lodash';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { NonEmptyString } from '../../../../../lib/domain/NonEmptyString';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';

type WatchlistRow = {
  id: string;
  name: string;
  userid: string;
  order: number;
  symbol: string;
};

@Injectable()
export class WatchlistPostgresDbRepository
  implements WatchlistWriteRepository, WatchlistReadOnlyRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}
  async getAllByUserId(userId: string): Promise<Watchlist[]> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<WatchlistRow>(
        `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
        watchlists.order as "order",
        watchlist_items.symbol as symbol
        FROM watchlists 
        LEFT JOIN watchlist_items on watchlists.id = watchlist_items.watchlist_id 
        WHERE user_id = $1
        `,
        [userId],
      );

    return values(groupBy(rows, 'id')).map((rows) => {
      return new Watchlist(
        rows[0].id,
        NonEmptyString.from(rows[0].name),
        rows[0].userid,
        rows[0].order,
        rows
          .map((row) => row.symbol)
          .filter(Boolean)
          .map((symbol) => SymbolWithExchange.from(symbol)),
      );
    });
  }

  async getById(userId: string, id: string) {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<WatchlistRow>(
        `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
        watchlists.order as "order",
        watchlist_items.symbol as symbol
        FROM watchlists 
        LEFT JOIN watchlist_items on watchlists.id = watchlist_items.watchlist_id 
        WHERE user_id = $1 AND watchlists.id = $2
        `,
        [userId, id],
      );

    if (!rows.length) {
      throw new Error(
        `Cannot get watchlist with id: ${id} for user: ${userId}`,
      );
    }

    return new Watchlist(
      rows[0].id,
      NonEmptyString.from(rows[0].name),
      rows[0].userid,
      rows[0].order,
      rows
        .map((row) => row.symbol)
        .filter(Boolean)
        .map((symbol) => SymbolWithExchange.from(symbol)),
    );
  }

  async save(watchlist: Watchlist) {
    await this.databaseClientGetter
      .getClient()
      .query(
        'INSERT INTO watchlists (id, name, user_id, "order") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [
          watchlist.id,
          watchlist.name.toString(),
          watchlist.userId,
          watchlist.order,
        ],
      );

    await this.databaseClientGetter
      .getClient()
      .query(
        `DELETE FROM watchlist_items WHERE watchlist_id = '${watchlist.id}'`,
      );

    if (!watchlist.isEmpty()) {
      await this.databaseClientGetter.getClient().query(
        `INSERT INTO watchlist_items (symbol, watchlist_id) VALUES ${Array.from(
          watchlist,
        )
          .map((item) => `('${item}', '${watchlist.id}')`)
          .join(',')}`,
      );
    }

    if (watchlist.deleted) {
      await this.databaseClientGetter
        .getClient()
        .query(
          `DELETE FROM watchlists WHERE id = '${watchlist.id}' AND user_id = '${watchlist.userId}'`,
        );
      return;
    }
  }
}
