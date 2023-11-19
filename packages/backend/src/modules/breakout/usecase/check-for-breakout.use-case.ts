import { Injectable } from '@nestjs/common';
import { BreakoutService } from '../domain/breakout.service';
import { WatchlistRepository } from '../../watchlist/domain/repository/watchlist.repository';

@Injectable()
export class CheckForBreakoutUseCase {
  constructor(
    private breakoutService: BreakoutService,
    private watchlistRepository: WatchlistRepository,
  ) {}

  async execute(): Promise<void> {
    const watchlist = await this.watchlistRepository.get();

    for (const symbol of watchlist) {
      await this.breakoutService.checkFor(symbol);
    }
  }
}
