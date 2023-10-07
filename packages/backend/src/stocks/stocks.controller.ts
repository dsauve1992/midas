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
    const [
      profile,
      enterpriseRatiosTtm,
      sharesFloat,
      ibdRating,
      fundamentalRating,
    ] = await Promise.all([
      this.financialModelingPrepService.getProfile(symbol),
      this.financialModelingPrepService.getEnterpriseRatioTTM(symbol),
      this.financialModelingPrepService.getSharesFloat(symbol),
      this.investorsBusinessDailyService.fetchStockRating(symbol),
      this.ratingService.computeRatingFor(symbol),
    ]);

    return {
      ...profile,
      returnOnEquity: enterpriseRatiosTtm.returnOnEquityTTM,
      outstandingShares: sharesFloat.outstandingShares,
      fundamentalRating: fundamentalRating,
      relativeStrengthRating: ibdRating.rsRating,
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
