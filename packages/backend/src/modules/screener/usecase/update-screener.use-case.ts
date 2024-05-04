import { Injectable, Logger } from '@nestjs/common';
import { TradingViewScreenerService } from '../infra/trading-view/trading-view-screener.service';
import { delay } from '../../../utils/delay';
import { ScreenerRepository } from '../domain/screener.repository';
import { ScreenerEntryFactory } from '../domain/screener-entry.factory';

@Injectable()
export class UpdateScreenerUseCase {
  private readonly logger = new Logger(UpdateScreenerUseCase.name);

  constructor(
    private screenerFetcherService: TradingViewScreenerService,
    private screenerRepository: ScreenerRepository,
    private screenerEntryFactory: ScreenerEntryFactory,
  ) {}

  async execute() {
    try {
      await this.screenerRepository.deleteAll();

      const symbols = await this.screenerFetcherService.search();

      const entries = await Promise.all(
        symbols.map(async (symbol) => {
          await delay(3000); // TODO: to avoid rate limiting. But we should manage this inside fmpService
          return this.screenerEntryFactory.create(symbol);
        }),
      );

      entries
        .filter((midasEntry) => midasEntry.hasGreatSetup())
        .forEach((entry) => this.screenerRepository.save(entry));
    } catch (e) {
      this.logger.error(e);
    }
  }
}
