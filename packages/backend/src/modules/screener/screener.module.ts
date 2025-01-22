import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { ScreenerRestController } from './controller/screener.rest.controller';

import { TradingViewScreenerRepository } from './infra/repository/trading-view/trading-view-screener.repository';
import { LabeledScreenerSymbolPostgresDbWriteRepository } from './infra/repository/postgres/labeled-screener-symbol-postgres-db-write.repository';
import { GetScreenerUseCase } from './usecase/get-screener.use-case';
import { LabeledScreenerSymbolPostgresDbReadRepository } from './infra/repository/postgres/labeled-screener-symbol-postgres-db.read-repository';

@Module({
  controllers: [ScreenerRestController],
  imports: [HttpModule, RatingModule, HistoricalDataModule],
  providers: [
    {
      provide: 'ScreenerRepository',
      useClass: TradingViewScreenerRepository,
    },
    {
      provide: 'LabeledScreenerSymbolWriteRepository',
      useClass: LabeledScreenerSymbolPostgresDbWriteRepository,
    },
    {
      provide: 'LabeledScreenerSymbolReadRepository',
      useClass: LabeledScreenerSymbolPostgresDbReadRepository,
    },
    GetScreenerUseCase,
  ],
})
export class ScreenerModule {}
