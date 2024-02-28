import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { FmtString } from 'telegraf/format';

@Injectable()
export class TelegramBot {
  constructor(private configService: ConfigService) {}

  async sendMarkdown(message: string) {
    const bot = new Telegraf(
      this.configService.getOrThrow('TELEGRAM_BOT_TOKEN'),
    );

    await bot.telegram.sendMessage('6964735919', {
      text: message,
      parse_mode: 'MarkdownV2',
    } as FmtString);
  }
}
