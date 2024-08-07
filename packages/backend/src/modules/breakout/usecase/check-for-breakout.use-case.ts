import { Inject, Injectable } from '@nestjs/common';
import { BreakoutService } from '../domain/breakout.service';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { BaseUseCase } from '../../../lib/base-use-case';
import { TransactionalUnitOfWork } from '../../../lib/unit-of-work/transactional-unit-of-work.service';

@Injectable()
export class CheckForBreakoutUseCase extends BaseUseCase<void, void> {
  constructor(
    private breakoutService: BreakoutService,
    private fmpService: FinancialModelingPrepService,
    @Inject('UNIT_OF_WORK') unitOfWork: TransactionalUnitOfWork,
  ) {
    super(unitOfWork);
  }

  async executeUseCase(): Promise<void> {
    const { isTheStockMarketOpen } =
      await this.fmpService.getMarketOpeningInformation();

    // FIXME disabled feature : we need to set on which watchlist we want to check for breakout

    // if (isTheStockMarketOpen) {
    //   const watchlist = await this.watchlistRepository.getByUserId(
    //     'auth0|65554db56ac7eefb66a57439',
    //   );
    //
    //   for (const symbol of watchlist) {
    //     await this.breakoutService.checkFor(symbol);
    //   }
    // }
  }
}
