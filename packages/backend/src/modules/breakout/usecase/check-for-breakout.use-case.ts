import { Injectable } from '@nestjs/common';
import { BreakoutService } from '../domain/breakout.service';
import { WatchlistRepository } from '../../watchlist/domain/repository/watchlist.repository';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';

@Injectable()
export class CheckForBreakoutUseCase {
  constructor(
    private breakoutService: BreakoutService,
    private watchlistRepository: WatchlistRepository,
    private fmpService: FinancialModelingPrepService,
  ) {}

  async execute(): Promise<void> {
    const { isTheStockMarketOpen } =
      await this.fmpService.getMarketOpeningInformation();

    if (isTheStockMarketOpen) {
      const watchlist = await this.watchlistRepository.getByUserId('1'); // TODO double loop sur chacun ?

      for (const symbol of watchlist) {
        await this.breakoutService.checkFor(symbol);
      }
    }
  }
}
