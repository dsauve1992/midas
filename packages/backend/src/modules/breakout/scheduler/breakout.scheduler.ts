import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CheckForBreakoutUseCase } from '../usecase/check-for-breakout.use-case';

@Injectable()
export class BreakoutScheduler {
  constructor(private checkForBreakoutUseCase: CheckForBreakoutUseCase) {}

  @Cron('*/15 9-16 * * 1-5', { timeZone: 'America/Montreal' })
  async handleCron() {
    await this.checkForBreakoutUseCase.execute();
  }
}
