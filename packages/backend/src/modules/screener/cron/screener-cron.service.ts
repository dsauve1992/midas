import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AnalyseScreenerElementsUseCase } from '../usecase/analyse-screener-elements.use-case';

@Injectable()
export class ScreenerCronService {
  constructor(
    private analyseScreenerElementsUseCase: AnalyseScreenerElementsUseCase,
  ) {}

  @Cron('15 * * * *')
  handleCron() {
    return this.analyseScreenerElementsUseCase.execute();
  }
}
