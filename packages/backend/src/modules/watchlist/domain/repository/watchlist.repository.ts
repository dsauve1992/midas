import { Watchlist } from '../model/watchlist';

export interface WatchlistReadOnlyRepository {
  getAllByUserId(userId: string): Promise<Watchlist[]>;
}

export interface WatchlistWriteRepository {
  getById(userId: string, id: string): Promise<Watchlist>;
  save(watchlist: Watchlist): Promise<void>;
}
