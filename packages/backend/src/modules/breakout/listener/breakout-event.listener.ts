import { StockBreakoutEvent } from '../domain/event/stock-breakout.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TelegramBot } from '../../notification/service/telegram-bot';

@Injectable()
export class InitialAssignmentCreatedListener {
  constructor(private telegramBot: TelegramBot) {}

  @OnEvent(StockBreakoutEvent.TYPE)
  async handleInitialAssignmentCreatedEvent(event: StockBreakoutEvent) {
    const { symbol } = event;

    await this.telegramBot.sendMarkdown(`
    -------
    ### ${symbol}
    `);
  }
}
