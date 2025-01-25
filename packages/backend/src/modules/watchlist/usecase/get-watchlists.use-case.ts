import { Inject, Injectable } from '@nestjs/common';
import { WatchlistReadOnlyRepository } from '../domain/repository/watchlist.repository';
import { BaseMutationUseCase } from '../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { Watchlist } from '../domain/model/watchlist';

interface GetWatchlistUseCaseRequest {
  userId: string;
}

@Injectable()
export class GetWatchlistsUseCase extends BaseMutationUseCase<
  GetWatchlistUseCaseRequest,
  Watchlist[]
> {
  constructor(
    @Inject('WatchlistReadOnlyRepository')
    private watchlistRepository: WatchlistReadOnlyRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({ userId }: GetWatchlistUseCaseRequest) {
    return this.watchlistRepository.getAllByUserId(userId);
  }
}
