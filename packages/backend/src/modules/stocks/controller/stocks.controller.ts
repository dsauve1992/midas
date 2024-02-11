import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StockGeneralInformationResponseDto } from '../../../shared-types/response.dto';
import { GetStockGeneralInformationUseCase } from '../usecase/get-stock-general-information.use-case';
import { GetInsiderTradingUseCase } from '../usecase/get-insider-trading.use-case';
import { GetEarningsSurprisesUseCase } from '../usecase/get-earnings-surprises.use-case';
import { GetInstitutionalHoldingUseCase } from '../usecase/get-institutional-holding.use-case';
import { GetSocialSentimentUseCase } from '../usecase/get-social-sentiment.use-case';
import { GetQuarterlyIncomeStatementUseCase } from '../usecase/get-quarterly-income-statement.use-case';
import { GetEarningCallTranscriptSummaryUseCase } from '../usecase/get-earning-call-transcript-summary.use-case';
import { FinancialRecordDto } from '../../../shared-types/income-statement';
import { QuarterlyIncomeStatementMapper } from './mapper/quarterly-income-statement.mapper';
import { AnnuallyIncomeStatementMapper } from './mapper/annually-income-statement.mapper';
import { GetAnnuallyIncomeStatementUseCase } from '../usecase/get-annually-income-statement.use-case';
import { AuthGuard } from '@nestjs/passport';
import { GetAnnualAnalystEstimatesUseCase } from '../usecase/get-annual-analyst-estimates-use-case.service';
import { GetAnnuallyIncomeStatementV2UseCase } from '../usecase/get-annually-income-statement-v2.use-case';

@UseGuards(AuthGuard('jwt'))
@Controller('stocks/:symbol')
export class StocksController {
  constructor(
    private getStockGeneralInformationUseCase: GetStockGeneralInformationUseCase,
    private getInsiderTradingUseCase: GetInsiderTradingUseCase,
    private getEarningsSurprisesUseCase: GetEarningsSurprisesUseCase,
    private getInstitutionalOwnershipUseCase: GetInstitutionalHoldingUseCase,
    private getSocialSentimentUseCase: GetSocialSentimentUseCase,
    private getQuarterlyIncomeStatementUseCase: GetQuarterlyIncomeStatementUseCase,
    private getAnnuallyIncomeStatementUseCase: GetAnnuallyIncomeStatementUseCase,
    private getAnnuallyIncomeStatementV2UseCase: GetAnnuallyIncomeStatementV2UseCase,
    private getEarningCallTranscriptSummaryUseCase: GetEarningCallTranscriptSummaryUseCase,
    private getAnalystEstimatesUseCase: GetAnnualAnalystEstimatesUseCase,
    private quarterlyIncomeStatementMapper: QuarterlyIncomeStatementMapper,
    private annuallyIncomeStatementMapper: AnnuallyIncomeStatementMapper,
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
  ): Promise<FinancialRecordDto[]> {
    const history =
      await this.getQuarterlyIncomeStatementUseCase.execute(symbol);

    return history.map((incomeStatement) =>
      this.quarterlyIncomeStatementMapper.toDto(incomeStatement),
    );
  }

  @Get('income-statement/annually')
  async getAnnuallyIncomeStatement(
    @Param('symbol') symbol: string,
  ): Promise<FinancialRecordDto[]> {
    const history =
      await this.getAnnuallyIncomeStatementUseCase.execute(symbol);

    return history.map((incomeStatement) =>
      this.annuallyIncomeStatementMapper.toDto(incomeStatement),
    );
  }

  @Get('income-statement/annually-2')
  async getAnnuallyIncomeStatementV2(
    @Param('symbol') symbol: string,
  ): Promise<FinancialRecordDto[]> {
    const history =
      await this.getAnnuallyIncomeStatementV2UseCase.execute(symbol);

    return history.toFinancialRecordDtos();
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

  @Get('analyst-estimates')
  getEstimates(@Param('symbol') symbol: string) {
    return this.getAnalystEstimatesUseCase.execute(symbol);
  }
}
