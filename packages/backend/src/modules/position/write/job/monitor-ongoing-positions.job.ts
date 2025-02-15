import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OngoingPositionMonitoringService } from '../domain/service/ongoing-position-monitoring.service';

@Injectable()
export class MonitorOngoingPositionsJob {
  private readonly logger = new Logger(MonitorOngoingPositionsJob.name);

  constructor(
    private readonly ongoingPositionMonitoringService: OngoingPositionMonitoringService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.debug('start job');
    try {
      await this.ongoingPositionMonitoringService.run();
      this.logger.debug('job ended successfully');
    } catch (e) {
      this.logger.error('job ended with error:', e);
    }
  }
}
