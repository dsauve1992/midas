import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';

@Injectable()
export class GetWatchlistUseCase {
  constructor(private watchlistRepository: WatchlistRepository) {}

  async execute(userId: string) {
    return this.watchlistRepository.getByUserId(userId);
  }
}
