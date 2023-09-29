import { Controller, Get } from '@nestjs/common';
import { ScreenerFetcherService } from './screener-fetcher.service';

@Controller('screener')
export class ScreenerController {
  constructor(private screenerFetcherService: ScreenerFetcherService) {}

  @Get()
  async getScreener() {
    return this.screenerFetcherService.fetch();
  }
}
