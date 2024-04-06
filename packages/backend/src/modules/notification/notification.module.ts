import { Module } from '@nestjs/common';
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
export class NotificationModule {}
