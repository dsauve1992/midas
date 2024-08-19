import { Injectable } from '@nestjs/common';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';

@Injectable()
export class GetRealTimePriceUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  execute(symbol: string) {
    return this.financialModelingPrepService.getRealtimePrice(symbol);
  }
}
