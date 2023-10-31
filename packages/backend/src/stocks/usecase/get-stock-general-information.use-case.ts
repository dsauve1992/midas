import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';
import { ComputeFundamentalRatingUseCase } from '../../rating/usecase/compute-fundamental-rating.use-case';
import { StockGeneralInformationResponseDto } from '../../shared-types/response.dto';
import { ComputeTechnicalRatingUseCase } from '../../rating/usecase/compute-technical-rating.use-case';

@Injectable()
export class GetStockGeneralInformationUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
    private computeFundamentalRatingUseCase: ComputeFundamentalRatingUseCase,
    private computeTechnicalRatingUseCase: ComputeTechnicalRatingUseCase,
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
