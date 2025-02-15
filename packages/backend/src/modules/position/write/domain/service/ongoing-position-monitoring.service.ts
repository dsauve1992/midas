import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { OngoingPositionRepository } from '../repository/ongoing-position.repository';
import { Inject } from '@nestjs/common';

export interface RealtimePriceService {
  getPrice(symbol: SymbolWithExchange): Promise<number>;
}

export class OngoingPositionMonitoringService {
  constructor(
    @Inject('OngoingPositionRepository')
    private readonly ongoingPositionRepository: OngoingPositionRepository,
    private readonly realtimePriceService: RealtimePriceService,
  ) {}

  async run(): Promise<void> {
    const ongoingPositions = await this.ongoingPositionRepository.getAll();

    for (const position of ongoingPositions) {
      const currentPrice = await this.realtimePriceService.getPrice(
        position.symbol,
      );
      await position.check(currentPrice);
      await this.ongoingPositionRepository.save(position);
    }
  }
}
