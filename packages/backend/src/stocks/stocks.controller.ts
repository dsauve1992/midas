import { Controller, Get, Param } from '@nestjs/common';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { GetStockGeneralInformationUseCase } from './usecase/get-stock-general-information.use-case';
import { GetInsiderTradingUseCase } from './usecase/get-insider-trading.use-case';
import { GetEarningsSurprisesUseCase } from './usecase/get-earnings-surprises.use-case';
import { GetInstitutionalHoldingUseCase } from './usecase/get-institutional-holding.use-case';
import { GetSocialSentimentUseCase } from './usecase/get-social-sentiment.use-case';
import { GetQuarterlyIncomeStatementUseCase } from './usecase/get-quarterly-income-statement.use-case';
import { GetEarningCallTranscriptSummaryUseCase } from './usecase/get-earning-call-transcript-summary.use-case';
import { MissingIncomeStatement } from './domain/missing-income-statement';
import { RecordedIncomeStatement } from './domain/recorded-income-statement';
import { QuarterlyIncomeStatementDto } from '../../../shared-types/income-statement';

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

  @Get('income-statement/quarterly')
  async getQuarterlyIncomeStatement(
    @Param('symbol') symbol: string,
  ): Promise<QuarterlyIncomeStatementDto[]> {
    const history = await this.getIncomeStatementUseCase.execute(symbol);

    return history.map((incomeStatement) => {
      if (incomeStatement instanceof MissingIncomeStatement) {
        return {
          quarter: {
            year: incomeStatement.quarter.year,
            quarterNumber: incomeStatement.quarter.quarterNumber,
          },
        };
      } else if (incomeStatement instanceof RecordedIncomeStatement) {
        return {
          quarter: {
            year: incomeStatement.model.quarter.year,
            quarterNumber: incomeStatement.model.quarter.quarterNumber,
          },
          earnings: incomeStatement.model.earnings,
          sales: incomeStatement.model.sales,
          netProfitMargin: incomeStatement.model.netProfitMargin,
        } as QuarterlyIncomeStatementDto;
      }
    });
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
