import { Module } from '@nestjs/common';
import { CreatePositionWishUseCase } from './write/usecase/create-position-wish.use-case';
import { PositionController } from './position.controller';
import { PositionWishPostgresDbRepository } from './write/infra/repository/position-wish.postgres-db.repository';
import { ConfigModule } from '@nestjs/config';
import { PositionPostgresDbRepository } from './read/infra/position.postgres-db.repository';
import { TelegramModule } from '../telegram/telegram.module';
import { MonitorPendingPositionWishesJob } from './write/job/monitor-pending-position-wishes-job';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { MonitorPendingPositionWishesUseCase } from './write/usecase/monitor-pending-position-wishes.use-case';
import { HistoricalPriceService } from './write/domain/service/historical-price-service';
import { OngoingPositionPostgresDbRepository } from './write/infra/repository/ongoing-position.postgres-db.repository';
import { RemindToCreateBuyOrderJob } from './write/job/remind-to-create-buy-order-job';
import { RemindToCreateBuyOrderUseCase } from './write/usecase/remind-to-create-buy-order-use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    HistoricalDataModule,
  ],
  controllers: [PositionController],
  providers: [
    MonitorPendingPositionWishesJob,
    RemindToCreateBuyOrderJob,
    RemindToCreateBuyOrderUseCase,
    MonitorPendingPositionWishesUseCase,
    CreatePositionWishUseCase,
    HistoricalPriceService,
    {
      provide: 'PositionWishRepository',
      useClass: PositionWishPostgresDbRepository,
    },
    {
      provide: 'OngoingPositionRepository',
      useClass: OngoingPositionPostgresDbRepository,
    },
    {
      provide: 'PositionReadRepository',
      useClass: PositionPostgresDbRepository,
    },
  ],
  exports: [],
})
export class PositionModule {}
