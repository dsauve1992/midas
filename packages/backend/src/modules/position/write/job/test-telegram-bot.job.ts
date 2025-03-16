import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from '../../../telegram/telegram.service';

@Injectable()
export class TestTelegramBotJob {
  private readonly logger = new Logger(TestTelegramBotJob.name);

  constructor(private readonly bot: TelegramService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.debug('start job');
    try {
      const symbol = 'BTCUSDT';
      const quantity = 0.01;
      const targetPrice = 50000;

      const orderCreated = await this.bot.remindBuyOrder(
        symbol,
        quantity,
        targetPrice,
      );

      this.logger.debug('order created');
      if (orderCreated) {
        // Check if the order was executed
        const actualPrice = await this.bot.validateBuyOrderExecution(symbol);

        this.logger.debug('actualPrice:', actualPrice);

        if (actualPrice) {
          // Order was executed successfully
          return { success: true, symbol, quantity, price: actualPrice };
        }
      }

      return { success: false };

      this.logger.debug('job ended successfully');
    } catch (e) {
      this.logger.error('job ended with error:', e);
    }
  }
}
