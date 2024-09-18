import { Injectable } from '@nestjs/common';
import { AnalyseScreenerElementsUseCase } from '../usecase/analyse-screener-elements.use-case';

@Injectable()
export class ScreenerCronService {
  constructor(
    private analyseScreenerElementsUseCase: AnalyseScreenerElementsUseCase,
  ) {}

  // @Cron('0 * * * *')
  // handleCron() {
  //   return this.analyseScreenerElementsUseCase.execute();
  // }
}
