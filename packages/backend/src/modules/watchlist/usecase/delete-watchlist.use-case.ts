import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

interface DeleteWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
}

@Injectable()
export class DeleteWatchlistUseCase extends BaseUseCase<DeleteWatchlistUseCaseRequest> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    watchlistId,
  }: DeleteWatchlistUseCaseRequest) {
    const watchlist = await this.watchlistRepository.getById(
      userId,
      watchlistId,
    );

    watchlist.flagAsDeleted();

    await this.watchlistRepository.save(watchlist);
  }
}
