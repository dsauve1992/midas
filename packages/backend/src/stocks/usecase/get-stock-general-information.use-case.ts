import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { InvestorsBusinessDailyService } from '../../investors-business-daily/investors-business-daily.service';
import { RatingService } from '../../rating/usecase/rating.service';
import { StockGeneralInformationResponseDto } from '../../../../shared-types/response.dto';

@Injectable()
export class GetStockGeneralInformationUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
    private investorsBusinessDailyService: InvestorsBusinessDailyService,
    private ratingService: RatingService,
  ) {}
  async execute(symbol: string): Promise<StockGeneralInformationResponseDto> {
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
      this.investorsBusinessDailyService.getStockRating(symbol),
      this.ratingService.getRatingFor(symbol),
    ]);

    return {
      ...profile,
      returnOnEquity: enterpriseRatiosTtm.returnOnEquityTTM,
      outstandingShares: sharesFloat.outstandingShares,
      fundamentalRating: fundamentalRating,
      relativeStrengthRating: ibdRating.rsRating,
    };
  }
}
