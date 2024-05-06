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
    await this.screenerRepository.deleteAll();

    const symbols = await this.screenerFetcherService.search();

    for (const symbolWithExchange of symbols) {
      try {
        await delay(3000); // TODO: to avoid rate limiting. But we should manage this inside fmpService
        const entry =
          await this.screenerEntryFactory.create(symbolWithExchange);

        if (entry.hasGreatSetup()) {
          await this.screenerRepository.save(entry);
        }
      } catch (e) {
        this.logger.error(symbolWithExchange);
        this.logger.error(e);
      }
    }
  }
}
