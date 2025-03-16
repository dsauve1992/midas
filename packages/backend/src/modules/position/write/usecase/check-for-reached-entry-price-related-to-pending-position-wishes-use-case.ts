import { Inject, Injectable, Logger } from '@nestjs/common';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';

@Injectable()
export class CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase {
  private readonly logger = new Logger(
    CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase.name,
  );

  constructor(
    @Inject('PositionWishRepository')
    private positionWishRepository: PositionWishRepository,
    private historicalPriceService: HistoricalPriceService,
    private telegramService: TelegramService,
  ) {}

  async execute() {
    const pendingWishes = await this.positionWishRepository.getAllPending();

    for (const wish of pendingWishes) {
      this.logger.log(
        `Checking wish ${wish.id.toString()} : ${wish.symbol.toString()} - EP: ${wish.entryPrice}`,
      );
      const highestPrice =
        await this.historicalPriceService.getLast15MinHighestPriceFor(
          wish.symbol,
        );

      this.logger.log(
        `Highest price detected during last 15min : ${highestPrice}`,
      );

      if (highestPrice >= wish.entryPrice) {
        await this.telegramService.validateBuyOrderExecution(
          wish.symbol.toString(),
        );
      }
    }
  }
}
