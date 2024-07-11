import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { Watchlist } from '../domain/model/Watchlist';

interface GetWatchlistUseCaseRequest {
  userId: string;
}

@Injectable()
export class GetWatchlistUseCase extends BaseUseCase<
  GetWatchlistUseCaseRequest,
  Watchlist
> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({ userId }: GetWatchlistUseCaseRequest) {
    return this.watchlistRepository.getByUserId(userId);
  }
}
