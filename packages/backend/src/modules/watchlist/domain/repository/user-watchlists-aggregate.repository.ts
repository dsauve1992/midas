import { UserWatchlistsAggregate } from '../model/user-watchlists-aggregate';

export interface UserWatchlistsAggregateRepository {
  getById(userId: string): Promise<UserWatchlistsAggregate>;
  save(userWatchlistsAggregate: UserWatchlistsAggregate): Promise<void>;
}
