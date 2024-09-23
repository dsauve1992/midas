import { Controller, Get, Inject } from '@nestjs/common';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';
import { ScreenerRepository } from '../domain/repository/screener.repository';
import { StockTechnicalLabeler } from '../domain/service/stock-technical-labeler';

@Controller('screener')
export class ScreenerRestController {
  constructor(
    @Inject('ScreenerRepository')
    private screenerRepository: ScreenerRepository,
    private stockTechnicalLabeler: StockTechnicalLabeler,
  ) {}

  @Get()
  async getScreener(): Promise<NewScreenerEntryFrontendDto[]> {
    const snapshot = await this.screenerRepository.search();

    return snapshot.symbols;
  }
}
