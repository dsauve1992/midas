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
    const last15MinPriceRange =
      await this.historicalPriceService.getLast15MinPriceRangeFor(
        onGoingPosition.symbol,
      );

    if (last15MinPriceRange.low <= onGoingPosition.stopLoss) {
      this.telegramService
        .validateStopLossOrderExecution(onGoingPosition.symbol)
        .then((sellingPrice) => {
          if (sellingPrice) {
            onGoingPosition.registerStopLossHit(sellingPrice);
            this.ongoingPositionRepository.save(onGoingPosition);
          }
        });
    }
  }
}
