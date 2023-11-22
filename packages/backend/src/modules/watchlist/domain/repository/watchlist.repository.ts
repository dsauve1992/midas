import { Watchlist } from '../model/Watchlist';

export abstract class WatchlistRepository {
  abstract getByUserId(userId: string): Promise<Watchlist>;
  abstract save(watchlist: Watchlist): Promise<void>;
}
