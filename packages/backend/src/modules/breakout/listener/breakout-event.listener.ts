import { StockBreakoutEvent } from '../domain/event/stock-breakout.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { TELEGRAM_BOT } from '../../telegram/telegram.module';
import { Telegraf } from 'telegraf';
import * as Sentry from '@sentry/node';

@Injectable()
export class BreakoutEventListener {
  private static readonly TELEGRAM_CHAT_ID = '6964735919';

  constructor(@Inject(TELEGRAM_BOT) private bot: Telegraf) {}

  @OnEvent(StockBreakoutEvent.TYPE)
  async handleStockBreakoutEvent(event: StockBreakoutEvent) {
    try {
      await this.bot.telegram.sendMessage(
        BreakoutEventListener.TELEGRAM_CHAT_ID,
        event.toString(),
        {
          parse_mode: 'MarkdownV2',
        },
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  }
}
