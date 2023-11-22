import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';

@Injectable()
export class AddSymbolToWatchlistUseCase {
  constructor(private watchlistRepository: WatchlistRepository) {}

  async execute(userId: string, symbol: string) {
    const watchlist = await this.watchlistRepository.getByUserId(userId);

    watchlist.addSymbol(symbol);

    await this.watchlistRepository.save(watchlist);
  }
}
