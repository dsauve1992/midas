import { Injectable, Logger } from '@nestjs/common';
import { RatingService } from '../usecase/rating.service';
import { ScreenerService } from '../../screener/screener.service';
import { delay } from '../../utils/delay';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private ratingService: RatingService,
  ) {}

  @Cron('0 22 * * * *')
  async handleJob() {
    const symbols = await this.screenerFetcherService.search();

    for (const symbol of symbols) {
      try {
        const rating = await this.ratingService.getRatingFor(symbol);

        this.logger.debug(`rating for ${symbol}: ${rating}`);
      } catch (e) {
        this.logger.error(`error for  for ${symbol}`);
      }
      await delay(2000);
    }
  }
}
