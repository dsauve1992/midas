import { Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { UnitOfWork } from '../../../lib/unit-of-work';
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
    unitOfWork: UnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({ userId }: GetWatchlistUseCaseRequest) {
    return this.watchlistRepository.getByUserId(userId);
  }
}
