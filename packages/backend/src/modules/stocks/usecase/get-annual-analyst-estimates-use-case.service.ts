import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';

@Injectable()
export class GetAnnualAnalystEstimatesUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  execute(symbol: string) {
    return this.financialModelingPrepService.getAnalystEstimates(symbol, {
      period: 'annual',
    });
  }
}
