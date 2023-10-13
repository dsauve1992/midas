import { Controller, Get } from '@nestjs/common';
import { ScreenerService } from '../service/screener.service';
import { ScreenerRepository } from '../repository/screener.repository';

@Controller('screener')
export class ScreenerController {
  constructor(
    private screenerFetcherService: ScreenerService,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Get()
  async getScreener() {
    const symbols = await this.screenerFetcherService.search();

    await Promise.all(
      symbols.map((symbol) => this.screenerRepository.create({ symbol })),
    );

    return symbols;
  }
}
