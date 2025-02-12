import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { OnGoingPositionRepository } from '../repository/ongoing-position.repository';

export interface RealtimePriceService {
  getPrice(symbol: SymbolWithExchange): Promise<number>;
}

export class OngoingPositionMonitoringService {
  constructor(
    private readonly onGoingPositionRepository: OnGoingPositionRepository,
    private readonly realtimePriceService: RealtimePriceService,
  ) {}

  async monitorPositionWish(): Promise<void> {
    const ongoingPositions = await this.onGoingPositionRepository.getAll();

    for (const position of ongoingPositions) {
      const currentPrice = await this.realtimePriceService.getPrice(
        position.symbol,
      );
      await position.check(currentPrice);
    }
  }
}
