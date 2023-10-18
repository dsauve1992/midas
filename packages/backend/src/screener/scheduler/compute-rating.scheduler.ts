import { Injectable, Logger } from '@nestjs/common';
import { RatingService } from '../../rating/usecase/rating.service';
import { ScreenerService } from '../service/screener.service';
import { delay } from '../../utils/delay';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private ratingService: RatingService,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Cron('0 30 * * * *')
  async handleJob() {
    const symbols = await this.screenerFetcherService.search();

    for (const symbol of symbols) {
      try {
        const rating = await this.ratingService.getFundamentalRatingFor(symbol);
        await this.screenerRepository.create({
          symbol,
          fundamentalRating: rating,
        });

        this.logger.log(await this.ratingService.getTechnicalRatingFor(symbol));

        this.logger.debug(`rating for ${symbol}: ${rating}`);
      } catch (e) {
        this.logger.error(`error for ${symbol}`);
        this.logger.error(e);
      }
      await delay(500);
    }
  }
}
