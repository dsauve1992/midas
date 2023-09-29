import { Module } from '@nestjs/common';
import { ScreenerController } from './screener.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule],
})
export class ScreenerModule {}
