import { Inject, Injectable } from '@nestjs/common';
import { WatchlistWriteRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

interface RemoveSymbolFromWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
  symbol: string;
}

@Injectable()
export class RemoveSymbolFromWatchlistUseCase extends BaseUseCase<RemoveSymbolFromWatchlistUseCaseRequest> {
  constructor(
    @Inject('WatchlistWriteRepository')
    private watchlistRepository: WatchlistWriteRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    symbol,
    watchlistId,
    userId,
  }: RemoveSymbolFromWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getById(
      userId,
      watchlistId,
    );

    watchlist.removeSymbol(symbol);

    await this.watchlistRepository.save(watchlist);
  }
}
