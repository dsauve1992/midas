import { StockBreakoutEvent } from '../domain/event/stock-breakout.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InitialAssignmentCreatedListener {
  constructor(private configService: ConfigService) {}

  @OnEvent(StockBreakoutEvent.TYPE)
  async handleInitialAssignmentCreatedEvent(event: StockBreakoutEvent) {
    const { symbol } = event;

    const bot = new Telegraf(
      this.configService.getOrThrow('TELEGRAM_BOT_TOKEN'),
    );
    await bot.telegram.sendMessage('6964735919', `ALERT : ${symbol}`);
  }
}
