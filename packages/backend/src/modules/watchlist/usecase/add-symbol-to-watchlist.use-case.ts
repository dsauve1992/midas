import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { WatchlistWriteRepository } from '../domain/repository/watchlist.repository';
import { SymbolWithExchange } from '../../stocks/domain/symbol-with-exchange';

interface AddSymbolToWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
  symbolWithExchange: SymbolWithExchange;
}

@Injectable()
export class AddSymbolToWatchlistUseCase extends BaseUseCase<AddSymbolToWatchlistUseCaseRequest> {
  constructor(
    @Inject('WatchlistWriteRepository')
    private watchlistRepository: WatchlistWriteRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    watchlistId,
    symbolWithExchange,
  }: AddSymbolToWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getById(
      userId,
      watchlistId,
    );

    watchlist.addSymbol(symbolWithExchange);

    await this.watchlistRepository.save(watchlist);
  }
}
