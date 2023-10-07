import { Controller, Get, Param } from '@nestjs/common';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { GetStockGeneralInformationUseCase } from './usecase/get-stock-general-information.use-case';

@Controller('stocks/:symbol')
export class StocksController {
  constructor(
    private getStockGeneralInformationUseCase: GetStockGeneralInformationUseCase,
  ) {}

  @Get()
  async getGeneralInformation(
    @Param('symbol') symbol: string,
  ): Promise<StockGeneralInformationResponseDto> {
    return this.getStockGeneralInformationUseCase.execute(symbol);
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
