import { Watchlist } from './watchlist';
import { orderBy } from 'lodash';
import { NonEmptyString } from '../../../../lib/domain/NonEmptyString';

export class UserWatchlistsAggregate {
  constructor(
    readonly userId: string,
    private _watchlists: Set<Watchlist> = new Set<Watchlist>(),
  ) {}

  createWatchlist(name: NonEmptyString): Watchlist {
    this.assertNameIsUnique(name);

    const newWatchlist = Watchlist.init(
      this.userId,
      name,
      this._watchlists.size + 1,
    );

    this._watchlists.add(newWatchlist);

    return newWatchlist;
  }

  renameWatchlist(watchlistId: string, name: NonEmptyString) {
    this.assertNameIsUnique(name);

    const watchlist = Array.from(this._watchlists).find(
      (w) => w.id === watchlistId,
    );

    watchlist.rename(name);
  }

  private assertNameIsUnique(name: NonEmptyString) {
    const watchlistNames = Array.from(this._watchlists).map((w) =>
      w.name.toString().toLowerCase(),
    );

    if (watchlistNames.includes(name.toString().toLowerCase())) {
      throw new Error('Watchlist name must be unique');
    }
  }

  get watchlists(): Set<Watchlist> {
    return Object.freeze(
      new Set<Watchlist>(orderBy(Array.from(this._watchlists), ['order'])),
    );
  }

  deleteWatchlist(watchlistId: string) {
    const watchlist = Array.from(this._watchlists).find(
      (w) => w.id === watchlistId,
    );

    watchlist.flagAsDeleted();

    this.recalculateOrders();
  }

  private recalculateOrders() {
    let order = 0;
    for (const watchlist of this.watchlists) {
      watchlist.order = order;
      order++;
    }
  }
}
