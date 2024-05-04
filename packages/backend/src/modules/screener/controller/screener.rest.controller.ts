import { Controller, Get } from '@nestjs/common';
import { GetHierarchyUseCase } from '../usecase/get-hierarchy.use-case';

@Controller('screener')
export class ScreenerRestController {
  constructor(private getHierarchyUseCase: GetHierarchyUseCase) {}

  @Get('/')
  async getScreener() {
    return this.getHierarchyUseCase.execute();
  }
}
