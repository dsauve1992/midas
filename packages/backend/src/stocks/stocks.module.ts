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
import { GetIncomeStatementUseCase } from './usecase/get-income-statement.use-case';
import { GetEarningCallTranscriptSummaryUseCase } from './usecase/get-earning-call-transcript-summary.use-case';

@Module({
  controllers: [StocksController],
  imports: [HistoricalDataModule, InvestorsBusinessDailyModule, RatingModule],
  providers: [
    GetStockGeneralInformationUseCase,
    GetEarningsSurprisesUseCase,
    GetInsiderTradingUseCase,
    GetInstitutionalHoldingUseCase,
    GetSocialSentimentUseCase,
    GetIncomeStatementUseCase,
    GetEarningCallTranscriptSummaryUseCase,
  ],
})
export class StocksModule {}
