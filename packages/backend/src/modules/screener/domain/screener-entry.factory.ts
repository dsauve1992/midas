import { Injectable } from '@nestjs/common';
import { ScreenerEntryEntity } from './screener-entry.entity';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { FundamentalRatingService } from '../../rating/domain/service/fundamental-rating.service';
import { AverageDailyRangeService } from '../../rating/domain/service/average-daily-range.service';
import { RelativeStrengthService } from '../../rating/domain/service/relative-strength.service';
import { differenceInDays, parseISO } from 'date-fns';
import { sortBy } from 'lodash';
import { SymbolWithExchange } from '../infra/trading-view/trading-view-screener.service';

@Injectable()
export class ScreenerEntryFactory {
  constructor(
    private readonly fmpService: FinancialModelingPrepService,
    private readonly fundamentalRatingService: FundamentalRatingService,
    private readonly averageDailyRangeService: AverageDailyRangeService,
    private readonly relativeStrengthService: RelativeStrengthService,
  ) {}

  async create(
    symbolWithExchange: SymbolWithExchange,
  ): Promise<ScreenerEntryEntity> {
    const symbol = symbolWithExchange.symbol;
    const exchange = symbolWithExchange.exchange;

    const profile = await this.fmpService.getProfile(symbol);
    const fundamentalRating =
      await this.fundamentalRatingService.execute(symbol);
    const averageDailyRange =
      await this.averageDailyRangeService.execute(symbol);
    const { rsLine, rsLineSma50, rsLineSma200, _52WeeksHigh, _5WeeksHigh } =
      await this.relativeStrengthService.execute(symbol);
    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(symbol);

    return new ScreenerEntryEntity(
      symbol,
      exchange,
      profile.sector,
      profile.industry,
      rsLine,
      rsLineSma50,
      rsLineSma200,
      fundamentalRating,
      averageDailyRange,
      numberOfDaysUntilNextEarningCall,
      _5WeeksHigh,
      _52WeeksHigh,
    );
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
