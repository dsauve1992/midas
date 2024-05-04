import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { FundamentalRatingService } from '../../rating/domain/service/fundamental-rating.service';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { TechnicalRatingService } from '../../rating/domain/service/technical-rating.service';

@Injectable()
export class GetStockGeneralInformationUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
    private computeFundamentalRatingUseCase: FundamentalRatingService,
    private computeTechnicalRatingUseCase: TechnicalRatingService,
  ) {}
  async execute(symbol: string): Promise<StockGeneralInformationResponseDto> {
    const [
      profile,
      enterpriseRatiosTtm,
      sharesFloat,
      technicalRating,
      fundamentalRating,
    ] = await Promise.all([
      this.financialModelingPrepService.getProfile(symbol),
      this.financialModelingPrepService.getEnterpriseRatioTTM(symbol),
      this.financialModelingPrepService.getSharesFloat(symbol),
      this.computeTechnicalRatingUseCase.execute(symbol),
      this.computeFundamentalRatingUseCase.execute(symbol),
    ]);

    return {
      ...profile,
      returnOnEquity: enterpriseRatiosTtm.returnOnEquityTTM,
      outstandingShares: sharesFloat.outstandingShares,
      fundamentalRating: fundamentalRating,
      technicalRating: technicalRating,
    };
  }
}
