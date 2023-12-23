import { Injectable, Logger } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import { ScreenerService } from '../service/screener.service';
import { delay } from '../../../utils/delay';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron } from '@nestjs/schedule';
import { ComputeTechnicalRatingUseCase } from '../../rating/usecase/compute-technical-rating.use-case';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerEntryEntity } from '../domain/model/screener-entry.entity';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { ComputeAverageDailyRangeUseCase } from '../../rating/usecase/compute-average-daily-range.use-case';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private computeFundamentalRatingUseCase: ComputeFundamentalRatingUseCase,
    private computeTechnicalRatingUseCase: ComputeTechnicalRatingUseCase,
    private computeAverageDailyRangeUseCase: ComputeAverageDailyRangeUseCase,
    private fmpService: FinancialModelingPrepService,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Cron('25 6 * * *', { timeZone: 'America/Montreal' })
  async handleJob() {
    try {
      await this.screenerRepository.deleteAll();
      this.logger.debug('deleteAll');

      const symbols = await this.screenerFetcherService.search();

      for (const symbol of symbols) {
        try {
          const entry = await this.createScreenerEntry(symbol);

          await this.screenerRepository.create(entry);
        } catch (e) {
          this.logger.error(`error for ${symbol}`);
          this.logger.error(e);
        }
        await delay(500);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async createScreenerEntry(
    symbol: string,
  ): Promise<Omit<ScreenerEntryEntity, 'averageDailyRangeRanking'>> {
    const fundamentalRating =
      await this.computeFundamentalRatingUseCase.execute(symbol);
    const technicalRating =
      await this.computeTechnicalRatingUseCase.execute(symbol);
    const averageDailyRange =
      await this.computeAverageDailyRangeUseCase.execute(symbol);

    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(symbol);

    return {
      symbol,
      fundamentalRating,
      technicalRating,
      averageDailyRange,
      numberOfDaysUntilNextEarningCall,
    };
  }

  private async getNumberOfDaysUntilNextEarningCall(
    symbol: string,
  ): Promise<number | null> {
    try {
      const earningsCalendar = await this.fmpService.getEarningCalendar(symbol);

      let futureDates = earningsCalendar.filter(
        (item) => parseISO(item.date) > new Date(),
      );

      futureDates = sortBy(futureDates, ['date'], ['asc']);

      if (futureDates.length === 0) {
        return null;
      }

      const nextAnnouncementDate = parseISO(futureDates[0].date);

      return differenceInDays(nextAnnouncementDate, new Date());
    } catch (e) {
      return null;
    }
  }
}
