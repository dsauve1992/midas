import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RatingProcessorRunnerService {
  private readonly logger = new Logger(RatingProcessorRunnerService.name);
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
