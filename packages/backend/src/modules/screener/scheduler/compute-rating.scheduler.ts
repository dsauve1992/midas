import { Injectable, Logger } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import { ScreenerService } from '../service/screener.service';
import { delay } from '../../../utils/delay';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ComputeTechnicalRatingUseCase } from '../../rating/usecase/compute-technical-rating.use-case';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private computeFundamentalRatingUseCase: ComputeFundamentalRatingUseCase,
    private computeTechnicalRatingUseCase: ComputeTechnicalRatingUseCase,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_7PM, { timeZone: 'America/Montreal' })
  async handleJob() {
    const symbols = await this.screenerFetcherService.search();

    for (const symbol of symbols) {
      try {
        const fundamentalRating =
          await this.computeFundamentalRatingUseCase.execute(symbol);
        const technicalRating =
          await this.computeTechnicalRatingUseCase.execute(symbol);
        await this.screenerRepository.create({
          symbol,
          fundamentalRating,
          technicalRating,
        });

        this.logger.debug(`rating for ${symbol}: ${fundamentalRating}`);
      } catch (e) {
        this.logger.error(`error for ${symbol}`);
        this.logger.error(e);
      }
      await delay(500);
    }
  }
}
