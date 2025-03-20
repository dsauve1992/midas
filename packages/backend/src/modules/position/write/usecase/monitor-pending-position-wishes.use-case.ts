import { Inject, Injectable } from '@nestjs/common';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { HistoricalPriceService } from '../domain/service/historical-price-service';
import { TelegramService } from '../../../telegram/telegram.service';
import { OngoingPositionRepository } from '../domain/repository/ongoing-position.repository';

@Injectable()
export class MonitorPendingPositionWishesUseCase {
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
      const { high, low } =
        await this.historicalPriceService.getLast15MinPriceRangeFor(
          wish.symbol,
        );

      if (high >= wish.entryPrice) {
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

      if (low <= wish.stopLoss) {
        this.telegramService
          .askUserToCancelOrderBecauseStopLossHasBeenHit(
            wish.symbol,
            wish.stopLoss,
          )
          .then(async (done) => {
            if (done) {
              wish.setStopLossHit();

              await this.positionWishRepository.save(wish);
            }
          });
      }
    }
  }
}
