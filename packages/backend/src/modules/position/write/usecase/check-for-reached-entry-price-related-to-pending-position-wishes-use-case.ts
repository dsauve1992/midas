import { Inject, Injectable, Logger } from '@nestjs/common';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';
import { OngoingPositionRepository } from '../domain/repository/ongoing-position.repository';

@Injectable()
export class CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase {
  private readonly logger = new Logger(
    CheckForReachedEntryPriceRelatedToPendingPositionWishesUseCase.name,
  );

  constructor(
    @Inject('PositionWishRepository')
    private positionWishRepository: PositionWishRepository,
    @Inject('OngoingPositionRepository')
    private ongoingPositionRepository: OngoingPositionRepository,
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
        this.telegramService
          .validateBuyOrderExecution(wish.symbol)
          .then(async (buyPrice) => {
            if (buyPrice) {
              const ongoingPosition = wish.confirmBuyOrderExecuted(buyPrice);

              await this.positionWishRepository.save(wish);
              await this.ongoingPositionRepository.save(ongoingPosition);
            }
          });
      }
    }
  }
}
