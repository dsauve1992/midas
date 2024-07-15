import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradingViewScreenerService } from './infra/trading-view/trading-view-screener.service';
import { UpdateScreenerCronJobController } from './controller/update-screener-cron-job.controller';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { UpdateScreenerUseCase } from './usecase/update-screener.use-case';
import { TELEGRAM_BOT, TelegramModule } from '../telegram/telegram.module';
import { Telegraf } from 'telegraf';
import { GetHierarchyUseCase } from './usecase/get-hierarchy.use-case';
import { ScreenerRestController } from './controller/screener.rest.controller';
import { ScreenerRepository } from './domain/screener.repository';
import { ScreenerEntryFactory } from './domain/screener-entry.factory';
import { ScreenerPostgresDbRepository } from './infra/repository/postgres/screener-postgres-db.repository';
import { Pool } from 'pg';
import { TransactionalUnitOfWork } from '../../lib/unit-of-work/transactional-unit-of-work.service';

@Module({
  controllers: [ScreenerRestController],
  imports: [HttpModule, RatingModule, HistoricalDataModule, TelegramModule],
  providers: [
    UpdateScreenerUseCase,
    GetHierarchyUseCase,
    TradingViewScreenerService,
    {
      provide: ScreenerRepository,
      useClass: ScreenerPostgresDbRepository,
    },
    ScreenerEntryFactory,
    UpdateScreenerCronJobController,
  ],
})
export class ScreenerModule implements OnModuleInit {
  constructor(
    @Inject(TELEGRAM_BOT) private bot: Telegraf,
    private screenerFetcherService: TradingViewScreenerService,
    private screenerEntryFactory: ScreenerEntryFactory,
    @Inject('PG_CONNECTION_POOL') private readonly pool: Pool,
  ) {}

  async onModuleInit() {
    this.bot.command('screener', async (ctx) => {
      await ctx.reply('⏳ updating screener...');

      /*
FIXME : in the context of a telegram command, we cannot use nestjs dependency injection mecanism
 because UnitOFWork need to be Request scoped (But what is a Request in that context ?).
 So we need to create the unit of work by ourselves and inject that same instance into any dependency that needs it.
 But it's ok to use the dependency injection mecanism for the other dependencies.
 */
      const unitOfWork = new TransactionalUnitOfWork(this.pool);
      try {
        await new UpdateScreenerUseCase(
          this.screenerFetcherService,
          new ScreenerPostgresDbRepository(unitOfWork),
          this.screenerEntryFactory,
          unitOfWork,
        ).execute();
      } catch (e) {
        await ctx.reply(`❌ an error occured : ${e.message}`);
      }

      await ctx.reply('✅ screener updated');
    });
  }
}
