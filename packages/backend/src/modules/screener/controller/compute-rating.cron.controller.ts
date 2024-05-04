import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UpdateScreenerUseCase } from '../usecase/update-screener.use-case';

@Injectable()
export class ComputeRatingCronController {
  constructor(private updateScreenerUseCase: UpdateScreenerUseCase) {}

  @Cron('30 17 * * *', { timeZone: 'America/Montreal' })
  async handleJob() {
    await this.updateScreenerUseCase.execute();
  }
}
