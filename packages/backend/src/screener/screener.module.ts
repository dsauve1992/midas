import { Module } from '@nestjs/common';
import { ScreenerController } from './screener.controller';
import { HttpModule } from '@nestjs/axios';
import { ScreenerService } from './screener.service';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule],
  providers: [ScreenerService],
  exports: [ScreenerService],
})
export class ScreenerModule {}
