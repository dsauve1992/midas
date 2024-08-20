import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { UserWatchlistsAggregateRepository } from '../domain/repository/user-watchlists-aggregate.repository';

interface DeleteWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
}

@Injectable()
export class DeleteWatchlistUseCase extends BaseUseCase<DeleteWatchlistUseCaseRequest> {
  constructor(
    @Inject('UserWatchlistsAggregateRepository')
    private userWatchlistsAggregateRepository: UserWatchlistsAggregateRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    watchlistId,
  }: DeleteWatchlistUseCaseRequest) {
    const userWatchlistsAggregate =
      await this.userWatchlistsAggregateRepository.getById(userId);

    userWatchlistsAggregate.deleteWatchlist(watchlistId);

    await this.userWatchlistsAggregateRepository.save(userWatchlistsAggregate);
  }
}
