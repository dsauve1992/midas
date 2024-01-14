import { Injectable, Logger } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import {
  ScreenerService,
  TradingViewScreenerEntry,
} from '../service/screener.service';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron } from '@nestjs/schedule';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerEntryEntity } from '../domain/model/screener-entry.entity';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { ComputeAverageDailyRangeUseCase } from '../../rating/usecase/compute-average-daily-range.use-case';
import { CheckTechnicalSetupService } from '../../rating/domain/service/check-technical-setup.service';
import { delay } from '../../../utils/delay';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private computeFundamentalRatingUseCase: ComputeFundamentalRatingUseCase,
    private computeAverageDailyRangeUseCase: ComputeAverageDailyRangeUseCase,
    private fmpService: FinancialModelingPrepService,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Cron('0 8 * * *', { timeZone: 'America/Montreal' })
  async handleJob() {
    try {
      await this.screenerRepository.deleteAll();

      const results = await this.screenerFetcherService.search();

      console.table(results);

      for (const entry of results) {
        await this.processScreenerEntry(entry);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async processScreenerEntry(entry: TradingViewScreenerEntry) {
    try {
      const rightTechnicalSetup =
        await CheckTechnicalSetupService.hasStrongTechnicalSetup(entry);

      if (rightTechnicalSetup) {
        // TODO mieux expliciter la différence entre screener trading view vs screener interne
        const midasEntry = await this.createScreenerEntry(entry);
        await this.screenerRepository.create(midasEntry);
        await delay(3000);
      }
    } catch (e) {
      this.logger.error(`error for ${entry.symbol}`);
      this.logger.error(e);
    }
  }

  private async createScreenerEntry(
    entry: TradingViewScreenerEntry,
  ): Promise<ScreenerEntryEntity> {
    const fundamentalRating =
      await this.computeFundamentalRatingUseCase.execute(entry.symbol);
    const averageDailyRange =
      await this.computeAverageDailyRangeUseCase.execute(entry.symbol);

    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(entry.symbol); // TODO demander à trading view à la place

    return {
      symbol: entry.symbol,
      exchange: entry.exchange,
      industry: entry.industry,
      sector: entry.sector,
      fundamentalRating,
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
