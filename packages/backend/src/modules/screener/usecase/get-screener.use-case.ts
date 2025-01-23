import { Inject } from '@nestjs/common';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';

export class GetScreenerUseCase {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
  ) {}

  async execute(): Promise<NewScreenerEntryFrontendDto[]> {
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
