import { Controller, Get, Param } from '@nestjs/common';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { GetStockGeneralInformationUseCase } from './usecase/get-stock-general-information.use-case';
import { GetInsiderTradingUseCase } from './usecase/get-insider-trading.use-case';
import { GetEarningsSurprisesUseCase } from './usecase/get-earnings-surprises.use-case';
import { GetInstitutionalHoldingUseCase } from './usecase/get-institutional-holding.use-case';
import { GetSocialSentimentUseCase } from './usecase/get-social-sentiment.use-case';
import { GetQuarterlyIncomeStatementUseCase } from './usecase/get-quarterly-income-statement.use-case';
import { GetEarningCallTranscriptSummaryUseCase } from './usecase/get-earning-call-transcript-summary.use-case';

@Controller('stocks/:symbol')
export class StocksController {
  constructor(
    private getStockGeneralInformationUseCase: GetStockGeneralInformationUseCase,
    private getInsiderTradingUseCase: GetInsiderTradingUseCase,
    private getEarningsSurprisesUseCase: GetEarningsSurprisesUseCase,
    private getInstitutionalOwnershipUseCase: GetInstitutionalHoldingUseCase,
    private getSocialSentimentUseCase: GetSocialSentimentUseCase,
    private getIncomeStatementUseCase: GetQuarterlyIncomeStatementUseCase,
    private getEarningCallTranscriptSummaryUseCase: GetEarningCallTranscriptSummaryUseCase,
  ) {}

  @Get()
  async getGeneralInformation(
    @Param('symbol') symbol: string,
  ): Promise<StockGeneralInformationResponseDto> {
    return this.getStockGeneralInformationUseCase.execute(symbol);
  }

  @Get('income-statement.ts')
  getIncomeStatement(@Param('symbol') symbol: string) {
    return this.getIncomeStatementUseCase.execute(symbol);
  }

  @Get('earning-call-transcript-summary')
  getEarningCallTranscript(@Param('symbol') symbol: string) {
    return this.getEarningCallTranscriptSummaryUseCase.execute(symbol);
  }

  @Get('earnings-surprises')
  getEarningsSurprises(@Param('symbol') symbol: string) {
    return this.getEarningsSurprisesUseCase.execute(symbol);
  }

  @Get('insider-trading')
  getInsiderTrading(@Param('symbol') symbol: string) {
    return this.getInsiderTradingUseCase.execute(symbol);
  }

  @Get('institutional-ownership')
  getInstitutionalHolding(@Param('symbol') symbol: string) {
    return this.getInstitutionalOwnershipUseCase.execute(symbol);
  }

  @Get('social-sentiment')
  getSocialSentiment(@Param('symbol') symbol: string) {
    return this.getSocialSentimentUseCase.execute(symbol);
  }
}
