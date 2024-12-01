import { BaseUseCase } from '../../../lib/base-use-case';
import { Inject } from '@nestjs/common';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { UnitOfWork } from '../../../lib/unit-of-work/unit-of-work';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';

export class GetScreenerUseCase extends BaseUseCase<
  void,
  NewScreenerEntryFrontendDto[]
> {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    @Inject('UNIT_OF_WORK') unitOfWork: UnitOfWork,
  ) {
    super(unitOfWork);
  }

  async executeUseCase(): Promise<NewScreenerEntryFrontendDto[]> {
    const snapshot = await this.screenerRepository.search();

    return snapshot.entries.map((entry) => {
      return {
        symbol: entry.symbol.symbol,
        exchange: entry.symbol.exchange,
        sector: entry.sector,
        industry: entry.industry,
        capitalisation: entry.capitalisation,
        open: entry.open,
        high: entry.high,
        low: entry.low,
        close: entry.close,
        volume: entry.volume,
        ema10: entry.ema10,
        ema20: entry.ema20,
        sma30: entry.sma30,
      };
    });
  }
}
