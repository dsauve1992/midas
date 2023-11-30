import { Module } from '@nestjs/common';
import { TelegramBot } from './service/telegram-bot';

@Module({
  providers: [TelegramBot],
  exports: [TelegramBot],
})
export class NotificationModule {}
