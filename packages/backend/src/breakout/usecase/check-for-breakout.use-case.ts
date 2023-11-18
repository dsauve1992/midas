import { Injectable } from '@nestjs/common';
import { BreakoutService } from '../domain/breakout.service';

@Injectable()
export class CheckForBreakoutUseCase {
  constructor(private breakoutService: BreakoutService) {}

  async execute(symbol: string) {
    // const watchlist = this.await this.watchlistRepository.get() TODO getFor current user
    // for (const ticker in watchlist) {
    await this.breakoutService.checkFor(symbol);
    // }
  }
}
