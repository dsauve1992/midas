import { Inject, Injectable } from '@nestjs/common';
import { WatchlistRepository } from '../domain/repository/watchlist.repository';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { Watchlist } from '../domain/model/Watchlist';

interface CreateWatchlistUseCaseRequest {
  userId: string;
  name: string;
}

@Injectable()
export class CreateWatchlistUseCase extends BaseUseCase<CreateWatchlistUseCaseRequest> {
  constructor(
    private watchlistRepository: WatchlistRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    name,
  }: CreateWatchlistUseCaseRequest) {
    const watchlist = Watchlist.init(userId, name);

    await this.watchlistRepository.save(watchlist);
  }
}
