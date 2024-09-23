import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { TelegramModule } from '../telegram/telegram.module';
import { ScreenerRestController } from './controller/screener.rest.controller';
import { ScreenerCronService } from './cron/screener-cron.service';

import { StockTechnicalAnalyser } from './domain/service/stock-technical-analyser';
import { AnalyseScreenerElementsUseCase } from './usecase/analyse-screener-elements.use-case';
import { StockTechnicalLabeler } from './domain/service/stock-technical-labeler';
import { TradingViewScreenerRepository } from './infra/repository/trading-view/trading-view-screener.repository';
import { LabeledScreenerSymbolPostgresDbRepository } from './infra/repository/postgres/labeled-screener-symbol-postgres-db.repository';

@Module({
  controllers: [ScreenerRestController],
  imports: [HttpModule, RatingModule, HistoricalDataModule, TelegramModule],
  providers: [
    {
      provide: 'ScreenerRepository',
      useClass: TradingViewScreenerRepository,
    },
    {
      provide: 'LabeledScreenerSymbolRepository',
      useClass: LabeledScreenerSymbolPostgresDbRepository,
    },
    StockTechnicalAnalyser,
    StockTechnicalLabeler,
    ScreenerCronService,
    AnalyseScreenerElementsUseCase,
  ],
})
export class ScreenerModule {}
