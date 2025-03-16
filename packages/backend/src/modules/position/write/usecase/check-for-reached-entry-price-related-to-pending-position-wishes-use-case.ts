import { Inject, Injectable } from '@nestjs/common';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';

@Injectable()
export class CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase {
  constructor(
    @Inject('PositionWishRepository')
    private positionWishRepository: PositionWishRepository,
    private historicalPriceService: HistoricalPriceService,
    private telegramService: TelegramService,
  ) {}

  async execute() {
    const pendingWishes = await this.positionWishRepository.getAllPending();

    for (const wish of pendingWishes) {
      const highestPrice =
        await this.historicalPriceService.getLast15MinHighestPriceFor(
          wish.symbol,
        );

      if (highestPrice >= wish.entryPrice) {
        await this.telegramService.validateBuyOrderExecution(
          wish.symbol.toString(),
        );
      }
    }
  }
}
