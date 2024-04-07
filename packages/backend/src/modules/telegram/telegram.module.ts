import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

export const TELEGRAM_BOT = 'TELEGRAM_BOT';

@Module({
  providers: [
    {
      provide: TELEGRAM_BOT,
      useFactory: (configService: ConfigService) => {
        const token = configService.getOrThrow('TELEGRAM_BOT_TOKEN');
        return new Telegraf(token);
      },
      inject: [ConfigService],
    },
  ],
  exports: [TELEGRAM_BOT],
})
export class TelegramModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(TELEGRAM_BOT) private readonly bot: Telegraf) {}

  async onModuleInit() {
    this.bot.command('ping', (ctx) => {
      ctx.reply('pong');
    });

    void this.bot.launch();
  }

  onModuleDestroy() {
    this.bot.stop();
  }
}
