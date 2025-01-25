import { Inject, Injectable } from '@nestjs/common';
import { WatchlistWriteRepository } from '../domain/repository/watchlist.repository';
import { BaseMutationUseCase } from '../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { SymbolWithExchange } from '../../stocks/domain/symbol-with-exchange';

interface RemoveSymbolFromWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
  symbolWithExchange: SymbolWithExchange;
}

@Injectable()
export class RemoveSymbolFromWatchlistUseCase extends BaseMutationUseCase<RemoveSymbolFromWatchlistUseCaseRequest> {
  constructor(
    @Inject('WatchlistWriteRepository')
    private watchlistRepository: WatchlistWriteRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    symbolWithExchange,
    watchlistId,
    userId,
  }: RemoveSymbolFromWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getById(
      userId,
      watchlistId,
    );

    watchlist.removeSymbol(symbolWithExchange);

    await this.watchlistRepository.save(watchlist);
  }
}
