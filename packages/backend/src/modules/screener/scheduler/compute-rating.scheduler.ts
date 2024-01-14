import { Injectable, Logger } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import {
  ScreenerEntryResponse,
  ScreenerService,
} from '../service/screener.service';
import { delay } from '../../../utils/delay';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron } from '@nestjs/schedule';
import { ComputeTechnicalRatingUseCase } from '../../rating/usecase/compute-technical-rating.use-case';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerEntryEntity } from '../domain/model/screener-entry.entity';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { ComputeAverageDailyRangeUseCase } from '../../rating/usecase/compute-average-daily-range.use-case';
import { CheckTechnicalSetupService } from '../../rating/domain/service/check-technical-setup.service';

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

  @Cron('15 5 * * *', { timeZone: 'America/Montreal' })
  async handleJob() {
    try {
      await this.screenerRepository.deleteAll();

      const results = await this.screenerFetcherService.search();

      for (const entry of results) {
        await this.processScreenerEntry(entry);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async processScreenerEntry(entry: ScreenerEntryResponse) {
    try {
      const rightTechnicalSetup =
        await CheckTechnicalSetupService.hasStrongTechnicalSetup(entry);

      if (rightTechnicalSetup) {
        // TODO mieux expliciter la différence entre screener trading view vs screener interne
        const midasEntry = await this.createScreenerEntry(entry.symbol);
        await this.screenerRepository.create(midasEntry);
      }

      await delay(3000);
    } catch (e) {
      this.logger.error(`error for ${entry.symbol}`);
      this.logger.error(e);
    }
  }

  private async createScreenerEntry(
    symbol: string,
  ): Promise<Omit<ScreenerEntryEntity, 'averageDailyRangeRanking'>> {
    const fundamentalRating =
      await this.computeFundamentalRatingUseCase.execute(symbol);
    const technicalRating =
      await this.computeTechnicalRatingUseCase.execute(symbol); // TODO pu besoin
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
