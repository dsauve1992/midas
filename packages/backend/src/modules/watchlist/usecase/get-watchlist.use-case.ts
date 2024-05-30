import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';

@Injectable()
export class GetWatchlistUseCase {
  constructor(private watchlistRepository: WatchlistRepository) {}

  async execute(userId: string) {
    try {
      const l = await this.watchlistRepository.getByUserId(userId);

      console.log(l);
      return l;
    } catch (e) {
      console.log(e);
    }
  }
}
