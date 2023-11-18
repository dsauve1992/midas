import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../../domain/repository/watchlist.repository';
import { Watchlist } from '../../domain/model/Watchlist';

@Injectable()
export class WatchlistDynamoDbRepository extends WatchlistRepository {
  constructor() {
    super();
  }

  async get() {
    return new Watchlist();
  }
}
