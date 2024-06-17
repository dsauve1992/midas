import { Injectable } from '@nestjs/common';
import { ScreenerEntryEntity } from './screener-entry.entity';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { FundamentalRatingService } from '../../rating/domain/service/fundamental-rating.service';
import { AverageDailyRangeService } from '../../rating/domain/service/average-daily-range.service';
import { RelativeStrengthService } from '../../rating/domain/service/relative-strength.service';
import { differenceInDays, format, parseISO, subDays } from 'date-fns';
import { sortBy } from 'lodash';
import { SymbolWithExchange } from '../infra/trading-view/trading-view-screener.service';
import { FiftyTwoWeeksHighService } from '../../rating/domain/service/fifty-two-weeks-high.service';

@Injectable()
export class ScreenerEntryFactory {
  constructor(
    private readonly fmpService: FinancialModelingPrepService,
    private readonly fundamentalRatingService: FundamentalRatingService,
    private readonly averageDailyRangeService: AverageDailyRangeService,
    private readonly relativeStrengthService: RelativeStrengthService,
    private readonly fiftyTwoWeeksHighService: FiftyTwoWeeksHighService,
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
    const { rsLine, rsLineSma50, rsLineSma200 } =
      await this.relativeStrengthService.execute(symbol);
    const numberOfDaysUntilNextEarningCall =
      await this.getNumberOfDaysUntilNextEarningCall(symbol);
    const daysSinceLast52WeekHigh =
      await this.fiftyTwoWeeksHighService.getNumberOfDaysSinceLast52WeekHigh(
        symbol,
      );

    const _10emaHistory = await this.fmpService.getDailyTechnicalIndicator(
      symbol,
      {
        type: 'ema',
        period: 10,
        from: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      },
    );

    const _20emaHistory = await this.fmpService.getDailyTechnicalIndicator(
      symbol,
      {
        type: 'ema',
        period: 20,
        from: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
      },
    );

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
      _10emaHistory.map(({ ema }) => ema),
      _20emaHistory.map(({ ema }) => ema),
      daysSinceLast52WeekHigh,
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
