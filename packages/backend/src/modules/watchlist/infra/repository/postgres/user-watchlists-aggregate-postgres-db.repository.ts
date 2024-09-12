import { Inject, Injectable } from '@nestjs/common';
import { Watchlist } from '../../../domain/model/watchlist';
import { UserWatchlistsAggregateRepository } from '../../../domain/repository/user-watchlists-aggregate.repository';
import { UserWatchlistsAggregate } from '../../../domain/model/user-watchlists-aggregate';
import { chain } from 'lodash';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { NonEmptyString } from '../../../../../lib/domain/NonEmptyString';
import { DatabaseClientGetter } from '../../../../../lib/unit-of-work/database-client-getter';

type WatchlistRow = {
  id: string;
  name: string;
  userid: string;
  symbol: string;
  orderw: number;
};

@Injectable()
export class UserWatchlistsAggregatePostgresDbRepository
  implements UserWatchlistsAggregateRepository
{
  constructor(
    @Inject('UNIT_OF_WORK') private databaseClientGetter: DatabaseClientGetter,
  ) {}

  async getById(userId: string): Promise<UserWatchlistsAggregate> {
    const { rows } = await this.databaseClientGetter
      .getClient()
      .query<WatchlistRow>(
        `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
        watchlists.order as orderw,
        watchlist_items.symbol as symbol
        FROM watchlists 
        LEFT JOIN watchlist_items on watchlists.id = watchlist_items.watchlist_id 
        WHERE user_id = $1
        `,
        [userId],
      );

    const watchlists = chain(rows)
      .groupBy('id')
      .toPairs()
      .map(([id, rows]) => {
        return new Watchlist(
          id,
          NonEmptyString.from(rows[0].name),
          rows[0].userid,
          rows[0].orderw,
          rows
            .map((row) => row.symbol)
            .filter(Boolean)
            .map((symbol) => SymbolWithExchange.from(symbol)),
        );
      })
      .value();

    return new UserWatchlistsAggregate(userId, new Set(watchlists));
  }

  async save(userWatchlistsAggregate: UserWatchlistsAggregate) {
    for (const watchlist of userWatchlistsAggregate.watchlists) {
      if (watchlist.deleted) {
        await this.databaseClientGetter.getClient().query(
          `
            DELETE FROM watchlists where id = $1`,
          [watchlist.id],
        );
      } else {
        await this.databaseClientGetter.getClient().query(
          `
            INSERT INTO watchlists (id, name, user_id, "order") 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT(id) 
            DO UPDATE SET
                name = EXCLUDED.name,
                "order" = EXCLUDED."order";`,
          [
            watchlist.id,
            watchlist.name.toString(),
            watchlist.userId,
            watchlist.order,
          ],
        );
      }

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
    }
  }
}
