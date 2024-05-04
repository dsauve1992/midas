import { Injectable, Logger } from '@nestjs/common';
import { FundamentalRatingService } from '../../rating/domain/service/fundamental-rating.service';
import {
  TradingViewScreenerEntry,
  TradingViewScreenerService,
} from '../infra/trading-view/trading-view-screener.service';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { AverageDailyRangeService } from '../../rating/domain/service/average-daily-range.service';
import { delay } from '../../../utils/delay';
import { RelativeStrengthService } from '../../rating/domain/service/relative-strength.service';
import { ScreenerEntryEntity } from '../domain/screener-entry.entity';
import { ScreenerRepository } from '../domain/screener.repository';

@Injectable()
export class UpdateScreenerUseCase {
  private readonly logger = new Logger(UpdateScreenerUseCase.name);

  constructor(
    private screenerFetcherService: TradingViewScreenerService,
    private fundamentalRatingService: FundamentalRatingService,
    private averageDailyRangeService: AverageDailyRangeService,
    private relativeStrengthService: RelativeStrengthService,
    private fmpService: FinancialModelingPrepService,
    private screenerRepository: ScreenerRepository,
  ) {}

  async execute() {
    try {
      await this.screenerRepository.deleteAll();

      const results = await this.screenerFetcherService.search();

      for (const entry of results) {
        this.logger.log(`processing ${entry.symbol}`);
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
        midasEntry.rsLineSma50 > midasEntry.rsLineSma200 &&
        midasEntry._5WeeksHigh === midasEntry._52WeeksHigh;
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
    const { symbol } = entry;

    const profile = await this.fmpService.getProfile(symbol);
    const fundamentalRating =
      await this.fundamentalRatingService.execute(symbol);
    const averageDailyRange =
      await this.averageDailyRangeService.execute(symbol);

    const { rsLine, rsLineSma50, rsLineSma200, _52WeeksHigh, _5WeeksHigh } =
      await this.relativeStrengthService.execute(symbol);

    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(symbol); // TODO demander à trading view à la place

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
      _5WeeksHigh,
      _52WeeksHigh,
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
