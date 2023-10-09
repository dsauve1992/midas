import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { InvestorsBusinessDailyModule } from '../investors-business-daily/investors-business-daily.module';
import { RatingModule } from '../rating/rating.module';
import { GetStockGeneralInformationUseCase } from './usecase/get-stock-general-information.use-case';
import { GetEarningsSurprisesUseCase } from './usecase/get-earnings-surprises.use-case';
import { GetInsiderTradingUseCase } from './usecase/get-insider-trading.use-case';
import { GetInstitutionalHoldingUseCase } from './usecase/get-institutional-holding.use-case';
import { GetSocialSentimentUseCase } from './usecase/get-social-sentiment.use-case';
import { GetQuarterlyIncomeStatementUseCase } from './usecase/get-quarterly-income-statement.use-case';
import { GetEarningCallTranscriptSummaryUseCase } from './usecase/get-earning-call-transcript-summary.use-case';
import { OwnershipModule } from '../ownership/ownership.module';

@Module({
  controllers: [StocksController],
  imports: [
    HistoricalDataModule,
    InvestorsBusinessDailyModule,
    RatingModule,
    OwnershipModule,
  ],
  providers: [
    GetStockGeneralInformationUseCase,
    GetEarningsSurprisesUseCase,
    GetInsiderTradingUseCase,
    GetInstitutionalHoldingUseCase,
    GetSocialSentimentUseCase,
    GetQuarterlyIncomeStatementUseCase,
    GetEarningCallTranscriptSummaryUseCase,
  ],
})
export class StocksModule {}
