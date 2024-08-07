import { Watchlist } from '../model/Watchlist';

export interface WatchlistReadOnlyRepository {
  getAllByUserId(userId: string): Promise<Watchlist[]>;
}

export interface WatchlistWriteRepository {
  getById(userId: string, id: string): Promise<Watchlist>;
  save(watchlist: Watchlist): Promise<void>;
}
