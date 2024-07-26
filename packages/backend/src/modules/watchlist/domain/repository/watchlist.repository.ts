import { Watchlist } from '../model/Watchlist';

export abstract class WatchlistRepository {
  abstract getAllByUserId(userId: string): Promise<Watchlist[]>;
  abstract getById(userId: string, id: string): Promise<Watchlist>;
  abstract save(watchlist: Watchlist): Promise<void>;
}
