import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

interface AddSymbolToWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
  symbol: string;
}

@Injectable()
export class AddSymbolToWatchlistUseCase extends BaseUseCase<AddSymbolToWatchlistUseCaseRequest> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    watchlistId,
    symbol,
  }: AddSymbolToWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getById(
      userId,
      watchlistId,
    );

    watchlist.addSymbol(symbol);

    await this.watchlistRepository.save(watchlist);
  }
}
