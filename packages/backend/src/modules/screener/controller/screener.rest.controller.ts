import { Controller, Get } from '@nestjs/common';
import { NewScreenerEntryFrontendDto } from '../../../shared-types/new-screener-entry-frontend.dto';
import { GetScreenerUseCase } from '../usecase/get-screener.use-case';

@Controller('screener')
export class ScreenerRestController {
  constructor(private getScreenerUseCase: GetScreenerUseCase) {}

  @Get()
  async getScreener(): Promise<NewScreenerEntryFrontendDto[]> {
    return this.getScreenerUseCase.execute();
  }
}
