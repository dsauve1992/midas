import { Injectable } from '@nestjs/common';
import { InsiderTradingEvent } from '../../shared-types/financial-modeling-prep';
import { FinancialModelingPrepService } from '../../historical-data/financial-modeling-prep.service';

@Injectable()
export class GetInsiderTradingUseCase {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}
  async execute(symbol: string): Promise<InsiderTradingEvent[]> {
    const insiderTradingHistory =
      await this.financialModelingPrepService.getInsiderTrading(symbol);

    return insiderTradingHistory.filter(({ transactionType }) =>
      ['S-Sale', 'P-Purchase'].includes(transactionType),
    );
  }
}
