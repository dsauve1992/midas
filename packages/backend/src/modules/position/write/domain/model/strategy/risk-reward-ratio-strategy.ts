import { Inject, Injectable } from '@nestjs/common';
import { OngoingPosition } from '../ongoing-position';
import { HistoricalPriceService } from '../../service/historical-price-service';
import { TelegramService } from '../../../../../telegram/telegram.service';
import { OngoingPositionRepository } from '../../repository/ongoing-position.repository';

@Injectable()
export class RiskRewardRatioStrategy {
  constructor(
    private historicalPriceService: HistoricalPriceService,
    private telegramService: TelegramService,
    @Inject('OngoingPositionRepository')
    private ongoingPositionRepository: OngoingPositionRepository,
  ) {}

  async apply(onGoingPosition: OngoingPosition): Promise<void> {
    const { high, low } =
      await this.historicalPriceService.getLast15MinPriceRangeFor(
        onGoingPosition.symbol,
      );

    if (low <= onGoingPosition.stopLoss) {
      this.handleStopLossHit(onGoingPosition);
    } else if (high >= onGoingPosition.computeR(2)) {
      this.handleInitialProfitTarget(onGoingPosition);
    }
  }

  private handleStopLossHit(onGoingPosition: OngoingPosition) {
    this.telegramService
      .validateStopLossOrderExecution(onGoingPosition.symbol)
      .then((sellingPrice) => {
        if (sellingPrice) {
          onGoingPosition.registerStopLossHit(sellingPrice);
          return this.ongoingPositionRepository.save(onGoingPosition);
        }
      });
  }

  private handleInitialProfitTarget(onGoingPosition: OngoingPosition) {
    const oneThirdOfInitialQuantity = Math.floor(onGoingPosition.quantity / 3);

    this.telegramService
      .askUserToTakeInitialProfitAndRaiseStopLoss({
        symbol: onGoingPosition.symbol,
        takeProfitPrice: onGoingPosition.computeR(2),
        numberOfShares: oneThirdOfInitialQuantity,
      })
      .then((sellingPrice) => {
        if (sellingPrice) {
          onGoingPosition.registerPartialTakeProfit(
            sellingPrice,
            oneThirdOfInitialQuantity,
          );
          return this.ongoingPositionRepository.save(onGoingPosition);
        }
      });
  }
}
