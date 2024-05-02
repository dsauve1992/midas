import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ScreenerController } from './controller/screener.controller';
import { HttpModule } from '@nestjs/axios';
import { TradingViewScreenerService } from './service/trading-view-screener.service';
import { ScreenerRepository } from './repository/screener.repository';
import { ComputeRatingScheduler } from './scheduler/compute-rating.scheduler';
import { RatingModule } from '../rating/rating.module';
import { HistoricalDataModule } from '../historical-data/historical-data.module';
import { UpdateScreenerUseCase } from './usecase/update-screener.use-case';
import { TELEGRAM_BOT, TelegramModule } from '../telegram/telegram.module';
import { Telegraf } from 'telegraf';
import { GetHierarchyUseCase } from './usecase/get-hierarchy.use-case';

@Module({
  controllers: [ScreenerController],
  imports: [HttpModule, RatingModule, HistoricalDataModule, TelegramModule],
  providers: [
    UpdateScreenerUseCase,
    GetHierarchyUseCase,
    TradingViewScreenerService,
    ScreenerRepository,
    ComputeRatingScheduler,
  ],
})
export class ScreenerModule implements OnModuleInit {
  constructor(
    @Inject(TELEGRAM_BOT) private bot: Telegraf,
    private updateScreenerUseCase: UpdateScreenerUseCase,
  ) {}

  async onModuleInit() {
    console.log('onModuleInit - ScreenerModule');

    this.bot.command('screener', async (ctx) => {
      await ctx.reply('⏳ updating screener...');

      this.updateScreenerUseCase.execute().finally(() => {
        ctx.reply('✅ screener updated');
      });
    });
  }
}
