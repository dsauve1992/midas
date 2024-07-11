import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../../../domain/repository/watchlist.repository';
import { Watchlist } from '../../../domain/model/Watchlist';
import { UnitOfWork } from '../../../../../lib/unit-of-work/unit-of-work';

@Injectable()
export class WatchlistPostgresDbRepository extends WatchlistRepository {
  constructor(@Inject('UNIT_OF_WORK') private unitOfWork: UnitOfWork) {
    super();
  }

  async getByUserId(userId: string) {
    const { rows } = await this.unitOfWork.getClient().query(
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
  }

  async save(watchlist: Watchlist) {
    await this.unitOfWork
      .getClient()
      .query(
        'INSERT INTO watchlists (id, name, user_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [watchlist.id, 'default', watchlist.userId],
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
  }
}
