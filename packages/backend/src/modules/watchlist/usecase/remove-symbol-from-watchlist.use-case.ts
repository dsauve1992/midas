import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { UnitOfWork } from '../../../lib/unit-of-work';

interface RemoveSymbolFromWatchlistUseCaseRequest {
  userId: string;
  symbol: string;
}

@Injectable()
export class RemoveSymbolFromWatchlistUseCase extends BaseUseCase<RemoveSymbolFromWatchlistUseCaseRequest> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    unitOfWork: UnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    symbol,
    userId,
  }: RemoveSymbolFromWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getByUserId(userId);

    watchlist.removeSymbol(symbol);

    await this.watchlistRepository.save(watchlist);
  }
}
