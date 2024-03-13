import { Injectable, Logger } from '@nestjs/common';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import {
  ScreenerService,
  TradingViewScreenerEntry,
} from '../service/screener.service';
import { ScreenerRepository } from '../repository/screener.repository';
import { Cron } from '@nestjs/schedule';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ScreenerEntryEntity } from '../../../shared-types/screener-entry.entity';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { ComputeAverageDailyRangeUseCase } from '../../rating/usecase/compute-average-daily-range.use-case';
import { delay } from '../../../utils/delay';
import { ComputeRelativeStrengthUseCase } from '../../rating/usecase/compute-relative-strength.use-case';

@Injectable()
export class ComputeRatingScheduler {
  private readonly logger = new Logger(ComputeRatingScheduler.name);

  constructor(
    private screenerFetcherService: ScreenerService,
    private computeFundamentalRatingUseCase: ComputeFundamentalRatingUseCase,
    private computeAverageDailyRangeUseCase: ComputeAverageDailyRangeUseCase,
    private computeRelativeStrengthUseCase: ComputeRelativeStrengthUseCase,
    private fmpService: FinancialModelingPrepService,
    private screenerRepository: ScreenerRepository,
  ) {}

  @Cron('10 22 * * *', { timeZone: 'America/Montreal' })
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

  private async processScreenerEntry(entry: TradingViewScreenerEntry) {
    try {
      const midasEntry = await this.createScreenerEntry(entry);
      const hasStrongRelativeStrength =
        midasEntry.rsLine > midasEntry.rsLineSma50 &&
        midasEntry.rsLineSma50 > midasEntry.rsLineSma200;
      const hasStrongADR = midasEntry.averageDailyRange >= 3;

      if (hasStrongRelativeStrength && hasStrongADR) {
        await this.screenerRepository.create(midasEntry);
      }
      await delay(3000);
    } catch (e) {
      this.logger.error(`error for ${entry.symbol}`);
      this.logger.error(e);
    }
  }

  private async createScreenerEntry(
    entry: TradingViewScreenerEntry,
  ): Promise<ScreenerEntryEntity> {
    const profile = await this.fmpService.getProfile(entry.symbol);
    const fundamentalRating =
      await this.computeFundamentalRatingUseCase.execute(entry.symbol);
    const averageDailyRange =
      await this.computeAverageDailyRangeUseCase.execute(entry.symbol);

    const { rsLine, rsLineSma50, rsLineSma200 } =
      await this.computeRelativeStrengthUseCase.execute(entry.symbol);

    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(entry.symbol); // TODO demander à trading view à la place

    return {
      symbol: entry.symbol,
      exchange: entry.exchange,
      industry: profile.industry,
      sector: profile.sector,
      rsLine,
      rsLineSma50,
      rsLineSma200,
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
