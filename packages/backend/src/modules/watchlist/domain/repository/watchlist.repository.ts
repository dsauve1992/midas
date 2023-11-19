import { Watchlist } from '../model/Watchlist';

export abstract class WatchlistRepository {
  abstract get(): Promise<Watchlist>;
  abstract save(watchlist: Watchlist): Promise<void>;
}
