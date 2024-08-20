import { Inject, Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';
import { UserWatchlistsAggregateRepository } from '../domain/repository/user-watchlists-aggregate.repository';

interface CreateWatchlistUseCaseRequest {
  userId: string;
  name: string;
}

@Injectable()
export class CreateWatchlistUseCase extends BaseUseCase<CreateWatchlistUseCaseRequest> {
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
