import { Controller, Get, Param } from '@nestjs/common';
import { FinancialModelingPrepService } from '../historical-data/financial-modeling-prep.service';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { InvestorsBusinessDailyService } from '../investors-business-daily/investors-business-daily.service';
import { RatingService } from '../rating/usecase/rating.service';

@Controller('stocks/:symbol')
export class StocksController {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
    private investorsBusinessDailyService: InvestorsBusinessDailyService,
    private ratingService: RatingService,
  ) {}

  @Get()
  async getGeneralInformation(
    @Param('symbol') symbol: string,
  ): Promise<StockGeneralInformationResponseDto> {
    const profile = await this.financialModelingPrepService.getProfile(symbol);
    const { returnOnEquityTTM } =
      await this.financialModelingPrepService.getEnterpriseRatioTTM(symbol);
    const { outstandingShares } =
      await this.financialModelingPrepService.getSharesFloat(symbol);

    const { rsRating } =
      await this.investorsBusinessDailyService.fetchStockRating(symbol);

    const rating = await this.ratingService.computeRatingFor(symbol);

    return {
      ...profile,
      returnOnEquity: returnOnEquityTTM,
      outstandingShares,
      fundamentalRating: rating,
      relativeStrengthRating: rsRating,
    };
  }

  @Get('income-statement')
  getIncomeStatement(@Param('symbol') symbol: string) {
    return `getIncomeStatement : ${symbol}`;
  }

  @Get('earning-call-transcript')
  getEarningCallTranscript(@Param('symbol') symbol: string) {
    return `getEarningCallTranscript : ${symbol}`;
  }

  @Get('earning-surprises')
  getEarningsSurprises(@Param('symbol') symbol: string) {
    return `getEarningsSurprises : ${symbol}`;
  }

  @Get('insider-trading')
  getInsiderTrading(@Param('symbol') symbol: string) {
    return `getInsiderTrading : ${symbol}`;
  }

  @Get('institutional-holding')
  getInstitutionalHolding(@Param('symbol') symbol: string) {
    return `getInstitutionalHolding : ${symbol}`;
  }

  @Get('social-sentiment')
  getSocialSentiment(@Param('symbol') symbol: string) {
    return `getSocialSentiment : ${symbol}`;
  }
}
