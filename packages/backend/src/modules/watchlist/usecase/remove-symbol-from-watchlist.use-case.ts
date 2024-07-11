import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

interface RemoveSymbolFromWatchlistUseCaseRequest {
  userId: string;
  symbol: string;
}

@Injectable()
export class RemoveSymbolFromWatchlistUseCase extends BaseUseCase<RemoveSymbolFromWatchlistUseCaseRequest> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
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
