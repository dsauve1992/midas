import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TradingViewScreenerService } from './infra/trading-view/trading-view-screener.service';
import { ComputeRatingCronController } from './controller/compute-rating.cron.controller';
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
    ComputeRatingCronController,
  ],
})
export class ScreenerModule implements OnModuleInit {
  constructor(
    @Inject(TELEGRAM_BOT) private bot: Telegraf,
    private updateScreenerUseCase: UpdateScreenerUseCase,
  ) {}

  async onModuleInit() {
    this.bot.command('screener', async (ctx) => {
      await ctx.reply('⏳ updating screener...');

      this.updateScreenerUseCase.execute().finally(() => {
        ctx.reply('✅ screener updated');
      });
    });
  }
}
