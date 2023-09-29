import { Module } from '@nestjs/common';
import { ScreenerController } from './screener.controller';
import { HttpModule } from '@nestjs/axios';
import { ScreenerFetcherService } from './screener-fetcher.service';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule],
  providers: [ScreenerFetcherService],
  exports: [ScreenerFetcherService],
})
export class ScreenerModule {}
