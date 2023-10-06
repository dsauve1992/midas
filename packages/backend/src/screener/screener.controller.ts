import { Controller, Get } from '@nestjs/common';
import { ScreenerService } from './screener.service';

@Controller('screener')
export class ScreenerController {
  constructor(private screenerFetcherService: ScreenerService) {}

  @Get()
  async getScreener() {
    return this.screenerFetcherService.fetch();
  }
}
