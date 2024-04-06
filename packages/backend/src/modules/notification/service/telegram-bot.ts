import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TELEGRAM_BOT } from '../notification.module';

@Injectable()
export class TelegramBot {
  constructor(@Inject(TELEGRAM_BOT) private bot: Telegraf) {}

  async sendMarkdown(message: string) {
    await this.bot.telegram.sendMessage('6964735919', message);
  }
}
