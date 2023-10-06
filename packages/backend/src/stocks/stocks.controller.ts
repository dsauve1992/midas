import { Controller, Get, Param } from '@nestjs/common';
import { FinancialModelingPrepService } from '../historical-data/financial-modeling-prep.service';
import { StockProfile } from '../../../shared-types/financial-modeling-prep';

@Controller('stocks/:symbol')
export class StocksController {
  constructor(
    private financialModelingPrepService: FinancialModelingPrepService,
  ) {}

  @Get()
  getGeneralInformation(
    @Param('symbol') symbol: string,
  ): Promise<StockProfile> {
    return this.financialModelingPrepService.getProfile(symbol);
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
