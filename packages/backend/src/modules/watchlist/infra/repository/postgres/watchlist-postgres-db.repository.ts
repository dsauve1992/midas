import { Inject, Injectable } from '@nestjs/common';
import {
  WatchlistReadOnlyRepository,
  WatchlistWriteRepository,
} from '../../../domain/repository/watchlist.repository';
import { Watchlist } from '../../../domain/model/Watchlist';
import { UnitOfWork } from '../../../../../lib/unit-of-work/unit-of-work';
import { groupBy, values } from 'lodash';

type WatchlistRow = {
  id: string;
  name: string;
  userid: string;
  symbol: string;
};

@Injectable()
export class WatchlistPostgresDbRepository
  implements WatchlistWriteRepository, WatchlistReadOnlyRepository
{
  constructor(@Inject('UNIT_OF_WORK') private unitOfWork: UnitOfWork) {}
  async getAllByUserId(userId: string): Promise<Watchlist[]> {
    const { rows } = await this.unitOfWork.getClient().query<WatchlistRow>(
      `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
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
        rows[0].name,
        rows[0].userid,
        new Set(rows.map((row) => row.symbol).filter(Boolean)),
      );
    });
  }
  async getById(userId: string, id: string) {
    const { rows } = await this.unitOfWork.getClient().query<WatchlistRow>(
      `
        SELECT
        watchlists.id as id,
        watchlists.name as name,
        watchlists.user_id as userid,
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
      rows[0].name,
      rows[0].userid,
      new Set(rows.map((row) => row.symbol).filter(Boolean)),
    );
  }

  async save(watchlist: Watchlist) {
    await this.unitOfWork
      .getClient()
      .query(
        'INSERT INTO watchlists (id, name, user_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [watchlist.id, watchlist.name, watchlist.userId],
      );

    await this.unitOfWork
      .getClient()
      .query(
        `DELETE FROM watchlist_items WHERE watchlist_id = '${watchlist.id}'`,
      );

    if (!watchlist.isEmpty()) {
      await this.unitOfWork.getClient().query(
        `INSERT INTO watchlist_items (symbol, watchlist_id) VALUES ${Array.from(
          watchlist,
        )
          .map((item) => `('${item}', '${watchlist.id}')`)
          .join(',')}`,
      );
    }

    if (watchlist.deleted) {
      await this.unitOfWork
        .getClient()
        .query(
          `DELETE FROM watchlists WHERE id = '${watchlist.id}' AND user_id = '${watchlist.userId}'`,
        );
      return;
    }
  }
}
