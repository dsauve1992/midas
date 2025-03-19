import { Inject, Injectable } from '@nestjs/common';
import { PositionWishRepository } from '../domain/repository/position-wish.repository';
import { TelegramService } from '../../../telegram/telegram.service';

@Injectable()
export class RemindToCreateBuyOrderUseCase {
  constructor(
    @Inject('PositionWishRepository')
    private positionWishRepository: PositionWishRepository,
    private telegramService: TelegramService,
  ) {}

  // TODO add test for this one

  async execute() {
    const wishes =
      await this.positionWishRepository.getAllWaitingForOrderCreated();

    for (const wish of wishes) {
      this.telegramService
        .remindBuyOrder(wish.symbol.toString(), wish.quantity, wish.entryPrice)
        .then(async (orderCreated) => {
          if (orderCreated) {
            wish.confirmBuyOrderCreated();
            await this.positionWishRepository.save(wish);
          }
        });
    }
  }
}
