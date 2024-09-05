import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { UserWatchlistsAggregateRepository } from '../domain/repository/user-watchlists-aggregate.repository';
import { NonEmptyString } from '../../../lib/domain/NonEmptyString';

interface RenameWatchlistUseCaseRequest {
  userId: string;
  watchlistId: string;
  name: NonEmptyString;
}

@Injectable()
export class RenameWatchlistUseCase extends BaseUseCase<RenameWatchlistUseCaseRequest> {
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
    name,
  }: RenameWatchlistUseCaseRequest) {
    const userWatchlistsAggregate =
      await this.userWatchlistsAggregateRepository.getById(userId);

    userWatchlistsAggregate.renameWatchlist(watchlistId, name);

    await this.userWatchlistsAggregateRepository.save(userWatchlistsAggregate);
  }
}
