import { Controller, Get } from '@nestjs/common';
import { ScreenerService } from '../service/screener.service';

@Controller('screener')
export class ScreenerController {
  constructor(private screenerFetcherService: ScreenerService) {}

  @Get()
  async getScreener() {
    return this.screenerFetcherService.search();
  }

  @Get('/new')
  async getNewScreener() {
    return this.screenerFetcherService.getHierarchy();
  }
}
