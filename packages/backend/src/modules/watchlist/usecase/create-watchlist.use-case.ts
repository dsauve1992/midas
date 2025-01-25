import { Inject, Injectable } from '@nestjs/common';
import { BaseMutationUseCase } from '../../../lib/base-mutation-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { UserWatchlistsAggregateRepository } from '../domain/repository/user-watchlists-aggregate.repository';
import { NonEmptyString } from '../../../lib/domain/NonEmptyString';

interface CreateWatchlistUseCaseRequest {
  userId: string;
  name: NonEmptyString;
}

@Injectable()
export class CreateWatchlistUseCase extends BaseMutationUseCase<CreateWatchlistUseCaseRequest> {
  constructor(
    @Inject('UserWatchlistsAggregateRepository')
    private userWatchlistsAggregateRepository: UserWatchlistsAggregateRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  protected async executeUseCase({
    userId,
    name,
  }: CreateWatchlistUseCaseRequest) {
    const userWatchlistsAggregate =
      await this.userWatchlistsAggregateRepository.getById(userId);

    userWatchlistsAggregate.createWatchlist(name);

    await this.userWatchlistsAggregateRepository.save(userWatchlistsAggregate);
  }
}
